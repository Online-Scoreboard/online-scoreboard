import { makeStyles } from '@material-ui/core/styles';

export type Classes = Record<'root' | 'grid', string>;

export const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  grid: {
    marginTop: theme.spacing(6),
  },
}));
