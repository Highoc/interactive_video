import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto',
    title: {
      fontSize: 24,
    },
  },
  palette: {
    common: {
      black: 'rgba(0, 0, 0, 1)',
      white: '#fff',
    },
    background: {
      paper: 'rgb(31,31,31)',
      default: 'rgb(255,9,0)',
    },
    primary: {
      light: 'rgb(255,9,0)',
      main: 'rgb(31,31,31)',
      dark: 'rgba(162, 24, 24, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(208, 2, 27, 1)',
      main: 'rgb(6,6,6)',
      dark: 'rgba(147, 5, 22, 1)',
      contrastText: 'rgba(208, 2, 27, 1)',
    },
    error: {
      light: 'rgb(255,255,255)',
      main: 'rgb(255,255,255)',
      dark: 'rgba(255, 255, 255, 1)',
      contrastText: 'rgba(255,255,255,0.38)',
    },
    text: {
      primary: 'rgb(255,255,255)',
      secondary: 'rgba(208, 2, 27, 1)',
      disabled: 'rgba(255, 255, 255, 1)',
      hint: 'rgba(255, 255, 255, 0.38)',
    },
  },
});

export default theme;
