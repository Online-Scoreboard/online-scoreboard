import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(({ spacing, palette }) => ({
  root: {
    background: 'hsl(14, 100%, 95%)',
    color: palette.primary.main,
  },
  heroContent: {
    padding: spacing(6, 0, 10),
  },
  heroImage: {
    width: '100%',
    padding: spacing(0, 4),
  },
  heroLogin: {
    marginTop: spacing(6),
  },
}));
