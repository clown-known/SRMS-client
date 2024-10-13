import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  // ... other theme settings
});

export default theme;