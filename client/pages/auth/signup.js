import buildSign from '../../api/build-sign';

const signup = () => {
  const client = buildSign('up');

  return client;
};

export default signup;
