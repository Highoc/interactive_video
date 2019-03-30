import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '../../components/Input/Input';
import withStyles from '@material-ui/core/styles/withStyles';
import { login } from '../../store/actions/authorization';
import { openDrawer } from '../../store/actions/buttonActions';
import { connect } from 'react-redux';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

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
      const passwordInput = inputs.find(elem => elem.name === "password");
      const loginInput = inputs.find(elem => elem.name === "login");
      onLogin(event, loginInput.value, passwordInput.value);
    }
    else {
      console.log('Invalid input');
    }
  };

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }


  render() {
    const {inputs} = this.state;
    const { classes} = this.props;
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
            <FormControl margin="normal" required fullWidth>
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


