import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
    color: theme.palette.getContrastText(green[600]),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  warning: {
    backgroundColor: amber[700],
    color: theme.palette.getContrastText(amber[700]),
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));
