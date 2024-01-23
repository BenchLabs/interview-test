import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FeedIcon from '@mui/icons-material/Feed';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import account from './_mocks_/account';
import AccountAvatar from './components/AccountAvatar';
import AppLogo from './components/AppLogo';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}>
          <AppLogo />
          <AccountAvatar account={account} />

          {/* Page List */}
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ color: 'primary' }} />
            </ListItem>
            <ListItem button component={Link} to="/transactions">
              <ListItemIcon>
                <ListIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Transactions" primaryTypographyProps={{ color: 'primary' }} />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FeedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Helpful Resources"
                primaryTypographyProps={{ color: 'primary' }}
              />
            </ListItem>
          </List>

          {/* Settings and Logout */}
          <List sx={{ marginTop: 'auto' }}>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
