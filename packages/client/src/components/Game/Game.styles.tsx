import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  loader: {
    marginRight: theme.spacing(1),
  },
  content: {
    marginBottom: theme.spacing(4),
  },
}));
