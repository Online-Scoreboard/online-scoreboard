import { makeStyles } from '@material-ui/core/styles';
import { green, blue } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  notificationRoot: {
    [theme.breakpoints.down('xs')]: {
      top: 0,
      left: -3,
      right: -3,
      minHeight: 78,
    },
  },
  success: {
    backgroundColor: green[600],
    color: theme.palette.getContrastText(green[600]),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  info: {
    backgroundColor: blue[700],
    color: theme.palette.getContrastText(blue[700]),
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
  close: {
    padding: theme.spacing(0.5),
  },
}));
