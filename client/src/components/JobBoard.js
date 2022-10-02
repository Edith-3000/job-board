import JobList from './JobList';
// import { jobs } from '../fake-data';
// import { JOBS_QUERY } from '../graphql/queries';
// import { getJobs } from '../graphql/queries';
// import { useEffect, useState } from 'react';
// import { useQuery } from '@apollo/client';
import { useJobs } from '../graphql/hooks';

// LOGIC MOVED TO '../graphql/hooks.js'
// custom React hook for GraphQL queries
// function useJobs() {
//     const { data, loading, error } = useQuery(JOBS_QUERY, {
//         fetchPolicy: 'network-only',
//     });

//     return {
//         jobs: data?.jobs,
//         loading,
//         error: Boolean(error),
//     };
// }

function JobBoard() {
    // const { data, loading, error } = useQuery(JOBS_QUERY);
    // const { data, loading, error } = useQuery(JOBS_QUERY, {
    //     fetchPolicy: 'network-only',
    // });

    const { jobs, loading, error } = useJobs();

    console.log('[JobBoard]', { jobs, loading, error });

    if(loading) {
        return <p>Loading....please be patient!</p>;
    }

    // const [jobs, setJobs] = useState([]);
    // console.log('[JobBoard] jobs:', jobs);
    // const [error, setError] = useState(false);

    // useEffect(() => {
    //     console.log('mounted');
    //     // getJobs().then((jobs) => setJobs(jobs));
    //     getJobs().then(setJobs)
    //         .catch((err) => {
    //             console.log(err);
    //             setError(true);
    //         });
    // }, []);

    if(error) {
        return <p>Sorry, something went wrong!</p>;
    }

    // const { jobs } = data;

    return (
        <div>
            <h1 className="title">
            Job Board
            </h1>
            <JobList jobs={jobs} />
        </div>
    );
}

export default JobBoard;
