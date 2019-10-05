import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  avatarWrapper: {
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  avatarIcon: {
    position: 'relative',

    '& svg': {
      filter: 'drop-shadow(1px -1px 0 rgba(0,0,0,0.3))',
    },
  },
}));
