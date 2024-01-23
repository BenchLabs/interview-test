import { Box, Grid, Typography } from '@mui/material';
import account from '../_mocks_/account';

export default function DashboardHeader() {
  return (
    <Box sx={{ pb: 5 }}>
      <Grid container spacing={2}>
        <Grid item sm={6} md={8}>
          <Typography variant="h4">Hi, {account.displayName}</Typography>
          <Typography variant="subtitle1">Here are your finances at a glance!</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
