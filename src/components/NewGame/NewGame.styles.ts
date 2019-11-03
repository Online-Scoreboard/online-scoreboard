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
  stepper: {
    padding: theme.spacing(0, 0, 6),
  },
  card: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardCentredContent: {
    textAlign: 'center',
  },
  cardAction: {
    marginLeft: 'auto',
  },
  cardValidationRed: {
    color: theme.palette.error.light,
  },
  cardValidationGreen: {
    color: theme.palette.text.primary,
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
  },
  yellowCheckbox: {
    ...playerCheckboBase,
    color: '#FFEB3B',
  },
  blueCheckbox: {
    ...playerCheckboBase,
    color: '#2196F3',
  },
  greenCheckbox: {
    ...playerCheckboBase,
    color: '#4CAF50',
  },
  grayCheckbox: {
    ...playerCheckboBase,
    color: '#9E9E9E',
  },
  brownCheckbox: {
    ...playerCheckboBase,
    color: '#795548',
  },
  whiteCheckbox: {
    ...playerCheckboBase,
    color: '#f5f5f5',
  },
  blackCheckbox: {
    ...playerCheckboBase,
    color: '#212121',
  },
  limeCheckbox: {
    ...playerCheckboBase,
    color: '#CDDC39',
  },
  tealCheckbox: {
    ...playerCheckboBase,
    color: '#009688',
  },
  purpleCheckbox: {
    ...playerCheckboBase,
    color: '#9C27B0',
  },
  pinkCheckbox: {
    ...playerCheckboBase,
    color: '#E91E63',
  },
}));
