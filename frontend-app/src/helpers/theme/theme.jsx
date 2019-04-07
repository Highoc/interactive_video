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
    fontFamily: 'Roboto',
    title: {
      fontSize: 26,
    },
    display1: {
      fontSize: 30,
      fontFamily: 'fantasy',
      lineHeight: 3,
    },
    display2: {
      fontSize: 15,
      fontFamily: 'Roboto',
    },
    display3: {
      fontSize: 12,
      fontFamily: 'Roboto',
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
      secondary: 'rgb(255,255,255)',
      disabled: 'rgba(255, 255, 255, 1)',
      hint: 'rgba(255, 255, 255, 0.38)',
    },
  },
});

export default theme;
