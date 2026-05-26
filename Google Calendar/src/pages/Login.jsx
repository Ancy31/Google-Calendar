import { Box, Button } from '@mui/material';
import { ROUTE_PATHS } from '../routes/routes';
import { useNavigate } from 'react-router-dom';
import { handleToken } from '../api/config';
const Login = () => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    handleToken();
    
    navigate(ROUTE_PATHS?.calendar);
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
