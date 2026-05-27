import { Box, Button } from '@mui/material';
import { handleToken } from '../api/config';
const Login = () => {
  const handleSuccess = () => {
    handleToken();
  };
  return (
    <Box sx={{ width: 'fit-content' }}>
      <Button
        onClick={() => handleSuccess()}
        onError={() => {
          console.log('Login Failed');
        }}
      >
        LOGIN
      </Button>
    </Box>
  );
};

export default Login;
