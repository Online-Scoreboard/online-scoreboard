import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/blueGrey';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepOrange,
    error: red,
    secondary: grey,
  },
});

export default theme;
