import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  link: {
    margin: theme.spacing(1, 1.5),
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));
