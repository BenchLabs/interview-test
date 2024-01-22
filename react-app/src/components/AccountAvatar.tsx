import { Avatar, Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AccountAvatar({ account }: { account: any }) {
  return (
    <Box sx={{ mb: 2, mx: 2 }}>
      <Link underline="none" component={RouterLink} to="#">
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: 'grey.100',
          }}
          style={{
            padding: '8px 16px',
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Avatar src={account.photoURL} alt="photoURL" style={{ marginRight: '8px' }} />
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {account.role}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}
