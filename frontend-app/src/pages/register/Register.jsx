import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Button, CssBaseline, FormControl, Paper, Typography, Input, InputLabel,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { registration } from '../../store/actions/register';
import styles from './Register.styles';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
    };
  }

  submitHandler(event) {
    event.preventDefault();
    const { onRegister } = this.props;
    let isValid = true;

    const passwordInput1 = document.getElementById('password1');
    const passwordInput2 = document.getElementById('password2');
    const loginInput = document.getElementById('username');

    if (passwordInput1.value !== passwordInput2.value) {
      isValid = false;
    }

    if (isValid) {
      const data = {
        username: loginInput.value,
        password1: passwordInput1.value,
        password2: passwordInput2.value,
      };
      onRegister(data);
    } else {
      console.log('Invalid input');
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Имя пользователя</InputLabel>
              <Input id="username" name="username" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Пароль</InputLabel>
              <Input name="password1" type="password" id="password1" autoComplete="current-password" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Подтвердите пароль</InputLabel>
              <Input name="password2" type="password" id="password2" autoComplete="current-password" />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={event => this.submitHandler(event)}
            >
              Зарегистрироваться
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onRegister: data => dispatch(registration(data)),
});

const mapStateToProps = state => ({
  loading: state.reg.loading,
  error: state.reg.error,
});


Register.propTypes = {
  onRegister: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Register));
