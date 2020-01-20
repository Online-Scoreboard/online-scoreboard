import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  grid: {
    marginTop: theme.spacing(6),
  },
}));
