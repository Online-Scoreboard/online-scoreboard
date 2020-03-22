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
  listItemIconWrapper: {
    minWidth: '80px',
  },
  listItemIcon: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  avatarIcon: {
    '& svg': {
      filter: 'drop-shadow(1px -1px 0 rgba(0,0,0,0.3))',
    },
  },
  emptyAvatarIcon: {
    width: '54px',
    height: '54px',
    color: '#eee',
    stroke: '#111',
    strokeWidth: '0.3px',
    padding: '3px',
  },
  redAvatar: {
    backgroundColor: '#F44336',
  },
  yellowAvatar: {
    backgroundColor: '#FFEB3B',
  },
  blueAvatar: {
    backgroundColor: '#2196F3',
  },
  greenAvatar: {
    backgroundColor: '#4CAF50',
  },
  grayAvatar: {
    backgroundColor: '#9E9E9E',
  },
  brownAvatar: {
    backgroundColor: '#795548',
  },
  whiteAvatar: {
    backgroundColor: '#f5f5f5',
  },
  blackAvatar: {
    backgroundColor: '#212121',
  },
  limeAvatar: {
    backgroundColor: '#CDDC39',
  },
  tealAvatar: {
    backgroundColor: '#009688',
  },
  purpleAvatar: {
    backgroundColor: '#9C27B0',
  },
  pinkAvatar: {
    backgroundColor: '#E91E63',
  },
  goldAvatar: {
    backgroundColor: '#FFD700',
  },
  aquamarineAvatar: {
    backgroundColor: '#7FFFD4',
  },
  darkorangeAvatar: {
    backgroundColor: '#FF8C00',
  },
}));
