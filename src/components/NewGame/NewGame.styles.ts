import { makeStyles } from '@material-ui/core/styles';

const teamCheckboxBase = {
  opacity: 0.6,
  '& svg': {
    fontSize: '2.75em',
  },
  '& .MuiIconButton-label': {
    borderRadius: '50%',
    padding: '3px',
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
  teamsSlider: {
    marginTop: theme.spacing(8),
  },
  teamsSliderLabel: {
    transform: 'scale(1.25)',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameReviewTeamIcons: {
    fontSize: '3em',
    marginRight: theme.spacing(1),
  },
  expansionPanelRoot: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
  },
  expansionPanelSummaryRoot: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    minHeight: 56,
  },
  expansionPanelDetailsRoot: {
    padding: theme.spacing(2),
  },
  checkboxChecked: {
    opacity: '1!important' as any,
    '& .MuiIconButton-label': {
      boxShadow: '1px 1px 13px rgba(0,0,0,0.35)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '& svg': {
      stroke: 'black',
      strokeWidth: '0.25px',
    },
  },
  redCheckbox: {
    ...teamCheckboxBase,
    color: '#F44336',
  },
  yellowCheckbox: {
    ...teamCheckboxBase,
    color: '#FFEB3B',
  },
  blueCheckbox: {
    ...teamCheckboxBase,
    color: '#2196F3',
  },
  greenCheckbox: {
    ...teamCheckboxBase,
    color: '#4CAF50',
  },
  grayCheckbox: {
    ...teamCheckboxBase,
    color: '#9E9E9E',
  },
  brownCheckbox: {
    ...teamCheckboxBase,
    color: '#795548',
  },
  whiteCheckbox: {
    ...teamCheckboxBase,
    color: '#f5f5f5',
  },
  blackCheckbox: {
    ...teamCheckboxBase,
    color: '#212121',
  },
  limeCheckbox: {
    ...teamCheckboxBase,
    color: '#CDDC39',
  },
  tealCheckbox: {
    ...teamCheckboxBase,
    color: '#009688',
  },
  purpleCheckbox: {
    ...teamCheckboxBase,
    color: '#9C27B0',
  },
  pinkCheckbox: {
    ...teamCheckboxBase,
    color: '#E91E63',
  },
  goldCheckbox: {
    ...teamCheckboxBase,
    color: '#FFD700',
  },
  aquamarineCheckbox: {
    ...teamCheckboxBase,
    color: '#7FFFD4',
  },
  darkorangeCheckbox: {
    ...teamCheckboxBase,
    color: '#FF8C00',
  },
}));
