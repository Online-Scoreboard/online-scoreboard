import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(({ spacing, palette }) => ({
  root: {
    background: 'hsl(14, 100%, 97%)',
    color: palette.primary.main,
    overflowX: 'hidden',
  },
  heroContent: {
    padding: spacing(6, 0, 18),
  },
  heroImage: {
    width: '100%',
    padding: spacing(0, 4),
  },
  heroLogin: {
    marginTop: spacing(6),
  },
  section: {
    padding: spacing(6, 0),
    backgroundColor: palette.background.paper,
    position: 'relative',
    zIndex: 0,

    '&:before': {
      zIndex: -1,
      height: '180px',
      width: '110%',
      content: '"c"',
      display: 'block',
      backgroundColor: palette.background.paper,
      marginTop: '-115px',
      marginLeft: '-5%',
      transform: 'rotateZ(-2deg)',
      position: 'absolute',
    },
  },
  article: {
    marginBottom: spacing(6),
  },
  icon: {
    fill: palette.primary.main,
  },
  featuresList: {
    marginLeft: '2em',
  },
  featuresListItems: {
    listStyleType: 'square',
  },
}));
