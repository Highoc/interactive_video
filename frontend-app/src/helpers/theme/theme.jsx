import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  overrides: {
    MuiGridList: { // Name of the component ⚛️ / style sheet
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 0,
        listStyle: 'none',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
      },
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Roboto',
    h6: {
      fontSize: 26,
    },
    h1: {
      fontSize: 30,
      fontFamily: 'fantasy',
      lineHeight: 3,
    },
    h2: {
      fontSize: 15,
      fontFamily: 'Roboto',
    },
    h3: {
      fontSize: 12,
      fontFamily: 'Roboto',
    },
    h4: {
      fontSize: 25,
      fontFamily: 'fantasy',
    },
  },
  palette: {
    common: {
      black: 'rgba(0, 0, 0, 1)',
      white: '#fff',
    },
    background: {
      paper: 'rgb(31,31,31)',
      default: 'rgb(38,38,38)',
    },
    primary: {
      light: 'rgb(255,9,0)',
      main: 'rgb(31,31,31)',
      dark: 'rgba(162, 24, 24, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgb(255,255,255)',
      main: 'rgb(255,255,255)',
      dark: 'rgba(255, 255, 255, 1)',
      contrastText: 'rgba(255,255,255,0.38)',
    },
    error: {
      light: 'rgba(208, 2, 27, 1)',
      main: 'rgb(6,6,6)',
      dark: 'rgba(147, 5, 22, 1)',
      contrastText: 'rgba(208, 2, 27, 1)',
    },
    text: {
      primary: 'rgb(255,255,255)',
      secondary: 'rgb(156,156,156)',
      disabled: 'rgba(255, 255, 255, 1)',
      hint: 'rgba(255, 255, 255, 0.38)',
    },
  },
});

export default theme;
