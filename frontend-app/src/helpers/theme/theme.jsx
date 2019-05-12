import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  overrides: {
    MuiInputBase: { // Name of the component ⚛️ / style sheet
      input: {
        color: 'rgb(255,255,255)',
      },
      error: {
        color: 'rgba(147, 5, 22, 1)',
      },
    },
    MuiButton: {
      textPrimary: {
        color: 'rgb(255,255,255)',
      },
      root: {
        '&$disabled': {
          color: 'rgb(124,124,124)',
        },
      },
    },
    MuiFormHelperText: { // Name of the component ⚛️ / style sheet
      root: {
        '&$error': {
          color: 'rgba(147, 5, 22, 1)',
        },
      },
    },
    MuiFormLabel: {
      root: {
        color: 'rgb(124,124,124)',
        '&$error': {
          color: 'rgba(147, 5, 22, 1)',
        },
        '&$focused': {
          color: 'rgb(178,235,255)',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          borderColor: 'rgb(124,124,124)',
        },
        '&$focused $notchedOutline': {
          borderColor: 'rgb(178,235,255)',
        },
        '&$error $notchedOutline': {
          borderColor: 'rgba(147, 5, 22, 1)',
        },
      },
    },
    MuiSelect: {
      icon: {
        color: 'rgb(255,255,255)',
      },
    },
    MuiCardHeader: {
      root: {
        padding: '8px',
      },
      title: {
        color: 'rgb(255,255,255)',
        fontSize: 20,
        fontFamily: 'Helvetica Neue Cyr Medium',
        padding: '5px 20px 5px 20px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },
    MuiFormControl: {
      root: {
        borderColor: 'rgb(124,124,124)',
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: 'rgb(124,124,124)',
        height: '0.5px',
      },
    },
    MuiIconButton: {
      root: {
        '&$disabled': {
          color: 'rgb(124,124,124)',
        },
      },
    },
    MuiStepIcon: {
      root: {
        color: 'rgb(156,156,156)',
        '&$active': {
          color: 'rgba(162, 24, 24, 1)',
        },
        '&$completed': {
          color: '#fff',
        },
      },
      text: {
        fontSize: 15,
        fontFamily: 'Helvetica Neue Cyr Medium',
      },
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: ['Roboto', 'Helvetica Neue Cyr Medium'],
    h6: {
      fontSize: 26,
    },
    h1: {
      fontSize: 30,
      fontFamily: 'Helvetica Neue Cyr Medium',
      lineHeight: 2,
    },
    h2: {
      fontSize: 15,
      fontFamily: 'Helvetica Neue Cyr Medium',
    },
    h3: {
      fontSize: 12,
      fontFamily: 'Helvetica Neue Cyr Medium',
    },
    h4: {
      fontSize: 25,
      fontFamily: 'Helvetica Neue Cyr Medium',
    },
    h5: {
      fontSize: 20,
      fontFamily: 'Helvetica Neue Cyr Medium',
    },
    fontSize: {
      small: 12,
      medium: 20,
      large: 35,
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
      black: 'rgb(20, 20, 20)',
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
      dark: 'rgb(124,124,124)',
      contrastText: 'rgba(255,255,255,0.38)',
    },
    error: {
      light: 'rgba(208, 2, 27, 1)',
      main: 'rgba(147, 5, 22, 1)',
      dark: 'rgba(147, 5, 22, 1)',
      contrastText: 'rgba(208, 2, 27, 1)',
    },
    text: {
      primary: 'rgb(255,255,255)',
      secondary: 'rgb(156,156,156)',
      disabled: 'rgb(156,156,156)',
      hint: 'rgba(255, 255, 255, 0.38)',
    },
  },
});

export default theme;
