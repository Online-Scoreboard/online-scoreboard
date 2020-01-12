import { makeStyles } from '@material-ui/core/styles';
import { amber } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  notificationRoot: {
    width: '100%',
    top: 0,
  },
  info: {
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
  close: {
    padding: theme.spacing(0.5),
  },
}));
