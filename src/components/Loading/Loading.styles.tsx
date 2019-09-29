import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    margin: theme.spacing(2),
  },
}));
