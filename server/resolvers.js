import { Company, Job } from './db.js';

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const resolvers = {
    Query: {
        job: (_root, { id }) => {
            console.log('id:', id);
            return Job.findById(id);
        },
        jobs: () => Job.findAll(),
        company: (_root, { id }) => Company.findById(id),
    },

    Job: {
        company: (job) => {
            //console.log('resolving company for job:', job);
            return Company.findById(job.companyId);
        },
    },

    Company: {
        jobs: (company) =>  Job.findAll((job) => job.companyId === company.id)
    },

    Mutation: {
        createJob: (_root, { input }, { user }) => {
            // console.log('[createJob] context:', context);
            // if(!context.auth) {
            //     throw new Error('Unauthorized');
            // }
            console.log('[createJob] user:', user);
            if(!user) {
                throw new Error('Unauthorized');
            }
            return Job.create({ ...input, companyId: user.companyId });
        },

        // to create a delay of 2 milliseconds
        // createJob: async (_root, { input }, { user }) => {
        //     // console.log('[createJob] context:', context);
        //     // if(!context.auth) {
        //     //     throw new Error('Unauthorized');
        //     // }

        //     await delay(2000);

        //     console.log('[createJob] user:', user);
        //     if(!user) {
        //         throw new Error('Unauthorized');
        //     }
        //     return Job.create({ ...input, companyId: user.companyId });
        // },

        // deleteJob: (_root, { id }) => Job.delete(id),
        deleteJob: async (_root, { id }, { user }) => {
            if(!user) {
                throw new Error('Unauthorized');
            }

            const job = await Job.findById(id);
            
            if(job.companyId !== user.companyId) {
                throw new Error('Unauthorized');
            }

            return Job.delete(id)
        },

        // updateJob: (_root, { input }) => Job.update(input),
        updateJob: async (_root, { input }, { user }) => {
            if(!user) {
                throw new Error('Unauthorized');
            }
            
            const job = await Job.findById(input.id);

            if(job.companyId !== user.companyId) {
                throw new Error('Unauthorized');
            }

            return Job.update({ ...input, companyId: user.companyId })
        },
    },
};