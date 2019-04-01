import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Fab from '@material-ui/core/Fab/index';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Redirect } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';
import styles from './EditAccount.styles';

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      inputs: [],
      isSent: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('core/profile//update/');
      pprint('EditAccount', result.data);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('EditAccount', error);
    }
  }

  getData() {
    const { inputs } = this.state;
    const result = {};
    inputs.map((input) => { result[input.name] = input.avatarUrl; return 0; });
    return result;
  }

  async submitHandler() {
    const { inputs } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }
    if (isValid) {
      try {
        const data = this.getData();
        console.log(data);
        await this.backend(json).post('core/profile/update/', data);
        this.setState({ isSent: true });
      } catch (error) {
        perror('EditAccount', error);
      }
    } else {
      console.log('Invalid input');
    }
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    input.avatarUrl = state.file;
    this.setState({ inputs });
  }

  render() {
    const { inputs, isSent } = this.state;
    const { classes } = this.props;
    if (isSent) {
      return <Redirect to="/account" />;
    }
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
          avatar={inputElement.url}
        />
      );
    });

    return (
      <div>
        <h2>Редактирование аккаунта</h2>
        {Inputs}
        <Fab
          variant="extended"
          color="primary"
          aria-label="Add"
          className={classes.margin}
          style={styles.button}
          onClick={event => this.submitHandler(event)}
        >
          <NavigationIcon className={classes.extendedIcon} />
          Изменить
        </Fab>
      </div>
    );
  }
}

EditAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditAccount);
