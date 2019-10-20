import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  card: {
    padding: theme.spacing(2),
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardAction: {
    marginLeft: 'auto',
  },
  avatar: {
    background: 'hsla(0, 0%, 20%, 1)',
    border: '1px solid hsla(0, 0%, 15%, 0.5)',
    borderRadius: '6px',
    padding: '8px 8px 0px',
    overflow: 'hidden',

    '& > svg': {
      filter: 'drop-shadow(0 0 2px rgba(230,230,230,0.35))',
    },
  },
}));
