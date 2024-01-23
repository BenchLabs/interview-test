import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#008B8C',
    },
    secondary: {
      main: '#B99A48',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '30px',
        },
      },
    },
  },
});

export default theme;
