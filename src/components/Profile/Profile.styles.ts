import { makeStyles } from '@material-ui/core/styles';

export type Classes = Record<
  'root' | 'content' | 'card' | 'cardTitle' | 'cardAction' | 'cardAction' | 'avatar',
  string
>;

export const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  content: {
    marginBottom: theme.spacing(4),
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
