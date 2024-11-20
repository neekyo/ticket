import buildSign from '../../api/build-sign';

const signin = () => {
  const client = buildSign('in');

  return client;
};

export default signin;
