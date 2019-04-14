import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Button, CssBaseline, FormControl, Paper, Typography, InputLabel, OutlinedInput,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { login } from '../../store/actions/authorization';
import { openDrawer } from '../../store/actions/buttonActions';
import styles from './SignIn.styles';


class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isCorrect: true,
    };
  }

  submitHandler(event) {
    event.preventDefault();
    const { onLogin } = this.props;

    const passwordInput = document.getElementById('password');
    const loginInput = document.getElementById('username');
    const isValid = true;

    if (isValid) {
      onLogin(event, loginInput.value, passwordInput.value);
    } else {
      this.setState({ isCorrect: false });
    }
  }


  render() {
    const { classes, error } = this.props;
    let errorMessage = <div />;
    if (error){
      errorMessage = <Typography variant="h2" color="error">Неправильный логин и/или пароль</Typography>;
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Вход
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Имя пользователя</InputLabel>
              <OutlinedInput id="username" name="username" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Пароль</InputLabel>
              <OutlinedInput name="password" type="password" id="password" autoComplete="current-password" />
            </FormControl>
            {errorMessage}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={event => this.submitHandler(event)}
            >
            Войти
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
  username: state.authorization.username,
  error: state.authorization.error,
});

const mapDispatchToProps = dispatch => ({

  onLogin: (event, loginVal, passwordVal) => {
    event.preventDefault();
    dispatch(login(loginVal, passwordVal));
    dispatch(openDrawer());
  },
});

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SignIn));
