import { makeStyles } from '@material-ui/core/styles';

const playerCheckboBase = {
  '& svg': {
    fontSize: '2.4em',
  },
};

export const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(6),
  },
  pageTitle: {
    marginBottom: theme.spacing(8),
  },
  content: {
    marginBottom: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardCenteredContent: {
    textAlign: 'center',
  },
  cardAction: {
    marginLeft: 'auto',
  },
  playersSlider: {
    marginTop: theme.spacing(8),
  },
  playersSliderLabel: {
    transform: 'scale(1.25)',
  },
  redCheckbox: {
    ...playerCheckboBase,
    color: '#F44336',
    '&$checked': {
      color: '#F00',
    },
  },
  yellowCheckbox: {
    ...playerCheckboBase,
    color: '#FFEB3B',
    '&$checked': {
      color: '#0FF',
    },
  },
  blueCheckbox: {
    ...playerCheckboBase,
    color: '#2196F3',
    '&$checked': {
      color: '#F00',
    },
  },
  greenCheckbox: {
    ...playerCheckboBase,
    color: '#4CAF50',
    '&$checked': {
      color: '#F00',
    },
  },
  grayCheckbox: {
    ...playerCheckboBase,
    color: '#9E9E9E',
    '&$checked': {
      color: '#F00',
    },
  },
  brownCheckbox: {
    ...playerCheckboBase,
    color: '#795548',
    '&$checked': {
      color: '#F00',
    },
  },
  whiteCheckbox: {
    ...playerCheckboBase,
    color: '#f5f5f5',
    '&$checked': {
      color: '#F00',
    },
  },
  blackCheckbox: {
    ...playerCheckboBase,
    color: '#212121',
    '&$checked': {
      color: '#F00',
    },
  },
  limeCheckbox: {
    ...playerCheckboBase,
    color: '#CDDC39',
    '&$checked': {
      color: '#F00',
    },
  },
  tealCheckbox: {
    ...playerCheckboBase,
    color: '#009688',
    '&$checked': {
      color: '#F00',
    },
  },
  purpleCheckbox: {
    ...playerCheckboBase,
    color: '#9C27B0',
    '&$checked': {
      color: '#F00',
    },
  },
  pinkCheckbox: {
    ...playerCheckboBase,
    color: '#E91E63',
    '&$checked': {
      color: '#F00',
    },
  },
}));
