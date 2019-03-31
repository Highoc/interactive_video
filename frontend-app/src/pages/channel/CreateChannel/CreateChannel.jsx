import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Fab from '@material-ui/core/Fab/index';
import NavigationIcon from '@material-ui/icons/Navigation';
import Input from '../../../components/Input/Input';
import { RequestResolver } from '../../../helpers/RequestResolver';
import styles from './CreateChannel.styles';
import { perror } from '../../../helpers/SmartPrint';

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
      inputs: [
        {
          type: 'text',
          name: 'name',
          value: '',
          description: 'Название канала',
          rules: {
            max_length: 64,
            required: true,
          },
        },
        {
          type: 'textarea',
          name: 'description',
          value: '',
          description: 'Описание канала',
          rules: {
            max_length: 4096,
            required: false,
          },
        }],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      await this.backend().get('channel/update/');
      this.setState({ isLoaded: true });
    } catch (error) {
      perror('CreateChannel', error);
    }
  }


  submitHandler(event) {
    const { inputs } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      console.log('Отправить можно');
    } else {
      console.log('Invalid input');
    }
    event.preventDefault();
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }

  render() {
    const { inputs, isLoaded } = this.state;
    const { classes } = this.props;
    if (!isLoaded) {
      return <div>Загружается</div>;
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
        />
      );
    });
    return (
      <div>
        <form>
          <h2>Создание канала</h2>
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
            Создать
          </Fab>
        </form>
      </div>
    );
  }
}

CreateChannel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateChannel);
