import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/blueGrey';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: deepOrange[400],
      main: deepOrange[600],
      dark: deepOrange[800],
      contrastText: 'hsl(14, 90%, 94%)',
    },
    error: red,
    secondary: grey,
    contrastThreshold: 3,
    text: {
      primary: 'hsl(14, 90%, 94%)',
      secondary: grey[100],
    },
    background: {
      default: '#ff9d00',
    },
  },
  typography: {
    fontFamily: '"Raleway", sans-serif',
    fontSize: 14,
    fontWeightMedium: 600,
    h1: { fontFamily: '"Bungee", sans-serif' },
    h2: { fontFamily: '"Bungee", sans-serif' },
    h3: { fontFamily: '"Bungee", sans-serif' },
    h4: { fontFamily: '"Bungee", sans-serif' },
    h5: { fontFamily: '"Bungee", sans-serif' },
    h6: { fontFamily: '"Bungee", sans-serif' },
    caption: { fontWeight: 600 },
  },
});

export default responsiveFontSizes(theme);
