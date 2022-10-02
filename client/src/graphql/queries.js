// If you want something simple and lightweight use 'graphql-request' library,
// but if you want more features go with '@apollo-client' library

// import { gql } from '@apollo/client'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
// import { request } from 'graphql-request'
// import { request, gql } from 'graphql-request'
import { getAccessToken } from '../auth'

const GRAPHQL_SERVER_URL = 'http://localhost:9005/graphql';

export const client = new ApolloClient({
    uri: GRAPHQL_SERVER_URL,
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: 'network-only',
    //     },
    //     mutate: {
    //         fetchPolicy: 'network-only',
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only',
    //     },
    // },
});

const JOB_DETAIL_FRAGMENT = gql`
    fragment JobDetail on Job {
        id
        title
        company {
            id
            name
        }
        description
    }
`;

export const JOB_QUERY = gql`
    query JobQuery($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${JOB_DETAIL_FRAGMENT}
`;

export const JOBS_QUERY = gql`
    query {
        jobs {
            id 
            title
            company {
                id
                name
            }
        }
    }
`;

export const CREATE_JOB_MUTATION = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
        job: createJob(input: $input) {
            id
            title
            company {
                id
                name
            }
            description
        }
    }
`;

export async function getJob(id) {
    const query = gql`
        # query name (like JobQuery) is always optional
        query JobQuery($id: ID!) {
            job(id: $id) {
                id 
                title
                company {
                    id
                    name
                }
                description
            }
        }
    `;

    const variables = { id };

    // const data = await request(GRAPHQL_SERVER_URL, query);
    // console.log('data: ', data);
    // return data.jobs;
    // const { job } = await request(GRAPHQL_SERVER_URL, query, variables);
    // return job;

    const { data: {job} } = await client.query({ query, variables });
    return job;
}

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id 
                title
                company {
                    id
                    name
                }
            }
        }
    `;

    // This is using 'graphql-request' library's request method
    // const data = await request(GRAPHQL_SERVER_URL, query);
    // console.log('data: ', data);
    // return data.jobs;

    // This is using '@apollo-client' library's query method
    const result = await client.query({ query, fetchPolicy: 'network-only' });
    // const result = await client.query({ query });
    return result.data.jobs;
    
    // destructuring nested objects
    // const { data: { jobs } } = await client.query({ query });
    // return jobs;
}

export async function getCompany(id) {
    const query = gql`
        # query name (like CompanyQuery) is always optional
        query CompanyQuery($id: ID!) {
            company(id: $id) {
                id 
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
    `;

    const variables = { id };

    // const data = await request(GRAPHQL_SERVER_URL, query);
    // console.log('data: ', data);
    // return data.jobs;
    // const { company } = await request(GRAPHQL_SERVER_URL, query, variables);
    // return company;

    const { data: { company} } = await client.query({ query, variables });
    return company;
}

export async function createJob(input) {
    // Using 'graphql-request' library
    // const query = gql`
    //     mutation CreateJobMutation($input: CreateJobInput!) {
    //         job: createJob(input: $input) {
    //             id
    //             title
    //             company {
    //                 id
    //                 name
    //             }
    //         }
    //     }
    // `;

    // const variables = { input };
    // const headers = { 'Authorization': 'Bearer ' +  getAccessToken() };

    // const { job } = await request(GRAPHQL_SERVER_URL, query, variables, headers);
    // return job;

    // Using '@apollo/client' library
    const mutation = gql`
        mutation CreateJobMutation($input: CreateJobInput!) {
            job: createJob(input: $input) {
                id
                title
                company {
                    id
                    name
                }
                description
            }
        }
    `;

    const variables = { input };
    const headers = { 'Authorization': 'Bearer ' +  getAccessToken() };
    const context = { headers };
    // const { data: { job } } = await client.mutate({ mutation, variables, context });

    const { data: { job } } = await client.mutate({ 
        mutation, 
        variables, 
        context,
        update: (cache, { data: { job } }) => {
            // console.log('[createJob] job:', job);
            cache.writeQuery({
                query: gql`
                    # query name (like JobQuery) is always optional
                    query JobQuery($id: ID!) {
                        job(id: $id) {
                            id 
                            title
                            company {
                                id
                                name
                            }
                            description
                        }
                    }
                `,
                variables: { id: job.id },
                data: { job },
            });
        },
    });

    return job;
}

/* Apollo Client by-default caches all the queries and mutations results in order to reduce 
   network traffic and make the app faster, but it does not always helps when we want to get (fetch)
   the latest data from server. So in order to remove this problem we can define fetchPolicy with
   every query and mutation.
*/