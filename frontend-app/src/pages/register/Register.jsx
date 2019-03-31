import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import Input from '../../components/Input/Input';
import { registration } from '../../store/actions/register';
import styles from './Register.styles';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: '',
          description: 'Логин',
          rules: {
            max_length: 64,
            required: true,
          },
        },
        {
          type: 'text',
          name: 'password1',
          value: '',
          description: 'Пароль',
          rules: {
            max_length: 64,
            required: true,
            min_length: 8,
          },
        },
        {
          type: 'text',
          name: 'password2',
          value: '',
          description: 'Подтвердите пароль',
          rules: {
            max_length: 64,
            required: true,
            min_length: 8,
          },
        },
      ],
    };
  }

  submitHandler(event) {
    event.preventDefault();
    const { inputs } = this.state;
    const { onRegister } = this.props;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    const loginInput = inputs.find(elem => elem.name === 'username');
    const passwordInput1 = inputs.find(elem => elem.name === 'password1');
    const passwordInput2 = inputs.find(elem => elem.name === 'password2');

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
            Регистрация
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
