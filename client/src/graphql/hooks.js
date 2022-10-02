import { useQuery } from '@apollo/client';
import { JOBS_QUERY, JOB_QUERY } from './queries';
import { CREATE_JOB_MUTATION } from './queries';
import { useMutation } from '@apollo/client';
import { getAccessToken } from '../auth';

// CUSTOM REACT HOOKS FOR QUERIES

export function useJob(id) {
    const { data, loading, error } = useQuery(JOB_QUERY, {
        variables: { id },
    });

    return {
        job: data?.job,
        loading,
        error: Boolean(error),
    };
}

export function useJobs() {
    const { data, loading, error } = useQuery(JOBS_QUERY, {
        fetchPolicy: 'network-only',
    });

    return {
        jobs: data?.jobs,
        loading,
        error: Boolean(error),
    };
}

// CUSTOM REACT HOOKS FOR MUTATIONS

export function useCreateJob() {
    const [mutate] = useMutation(CREATE_JOB_MUTATION);

    return {
        createJob: async (title, description) => {
            const { data: { job } } = await mutate({
                variables: { input: { title, description } },
                context: {
                    headers: { 'Authorization': 'Bearer ' + getAccessToken() },
                },
            });
            
            return job;
        },
    };
  }