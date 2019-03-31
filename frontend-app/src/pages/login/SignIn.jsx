import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Button, CssBaseline, FormControl, Paper, Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import Input from '../../components/Input/Input';
import { login } from '../../store/actions/authorization';
import { openDrawer } from '../../store/actions/buttonActions';
import styles from './SignIn.styles';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
      inputs: [
        {
          type: 'text',
          name: 'login',
          value: '',
          description: 'Логин',
          rules: {
            max_length: 64,
            required: true,
          },
        },
        {
          type: 'text',
          name: 'password',
          value: '',
          description: 'Пароль',
          rules: {
            max_length: 64,
            min_length: 8,
            required: true,
          },
        }],
    };
  }

  submitHandler(event) {
    event.preventDefault();
    const { inputs } = this.state;
    const { onLogin } = this.props;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }
    if (isValid) {
      const passwordInput = inputs.find(elem => elem.name === 'password');
      const loginInput = inputs.find(elem => elem.name === 'login');
      onLogin(event, loginInput.value, passwordInput.value);
    } else {
      console.log('Invalid input');
    }
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }


  render() {
    const { inputs } = this.state;
    const { classes } = this.props;
    const Inputs = Object.keys(inputs).map((key) => {
      const inputElement = inputs[key];
      return (
        <Input
          key={key}
          type={inputElement.type}
          name={inputElement.name}
          description={inputElement.description}
          value={inputElement.value}
          rules={inputElement.rules}
          callback={state => this.callbackInput(state)}
        />
      );
    });

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
            <FormControl margin="normal" fullWidth>
              {Inputs}
            </FormControl>
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
  isAuthorized: state.authorization.token !== null,
  username: state.authorization.username,
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
