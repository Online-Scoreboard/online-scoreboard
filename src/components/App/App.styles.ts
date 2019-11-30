import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  '@global': {
    '@keyframes floatingDice1': {
      from: {
        transform: 'rotate(0deg) translateX(0)',
        top: '150px',
      },
      to: {
        transform: 'rotate(120deg) translateX(40px)',
        top: '50px',
      },
    },
    '@keyframes floatingDice2': {
      from: {
        transform: 'rotate(0deg)',
        bottom: '120px',
      },
      to: {
        transform: 'rotate(75deg)',
        bottom: '50px',
      },
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
    a: {
      textDecoration: 'none',
    },
    'input:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 30px #610f46 inset !important',
      '-webkit-text-fill-color': '#eee !important',

      '&:hover, &:focus, &:active': {
        '-webkit-box-shadow': '0 0 0 30px #610f46 inset !important',
        '-webkit-text-fill-color': '#eee !important',
      },
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    position: 'relative',
    minHeight: '600px',
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  loader: {
    marginRight: theme.spacing(1),
  },
  floatingDice1: {
    position: 'absolute',
    left: '100px',
    animation: 'floatingDice1 2s infinite alternate ease-in-out',
  },
  floatingDice2: {
    position: 'absolute',
    right: '100px',
    animation: 'floatingDice2 3s infinite alternate ease-in-out',
  },
}));
