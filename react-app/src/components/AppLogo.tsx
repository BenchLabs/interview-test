import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from './logo.svg'; // Replace with the actual path to your logo

const AppLogo = () => {
  return (
    <Box display="flex" alignItems="center" padding={'14px'}>
      <img src={logo} alt="Logo" style={{ height: '3em', marginRight: '8px' }} />
      <Typography variant="h4" fontWeight="900">
        Bench
      </Typography>
    </Box>
  );
};

export default AppLogo;
