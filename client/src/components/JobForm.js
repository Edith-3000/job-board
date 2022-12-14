// import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router'
// import { createJob, CREATE_JOB_MUTATION } from '../graphql/queries';
// import { CREATE_JOB_MUTATION } from '../graphql/queries';
// import { getAccessToken } from '../auth';
import { useCreateJob } from '../graphql/hooks';

function JobForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  // const [mutate, result] = useMutation(CREATE_JOB_MUTATION);
  // const [mutate] = useMutation(CREATE_JOB_MUTATION);
  // const [mutate, { loading }] = useMutation(CREATE_JOB_MUTATION);
  
  const { createJob } = useCreateJob();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const { data: { job } } = await mutate({
    //     variables: { input: { title, description } },
    //     context: {
    //         headers: { 'Authorization': 'Bearer ' +  getAccessToken() },
    //     },
    // });

    const job = await createJob(title, description);

    // console.log('should post a new job:', { title, description });
    // const companyId = 'pVbRRBQtMVw6lUAkj1k43'; // Fix this
    // const job = await createJob({ title, description });
    // console.log('job created:', job);
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleSubmit}>
                Submit
              </button>
               {/* <button className="button is-link" onClick={handleSubmit} disabled={loading}>
                Submit
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
