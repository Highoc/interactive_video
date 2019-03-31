import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Fab from '@material-ui/core/Fab/index';
import NavigationIcon from '@material-ui/icons/Navigation';
import Input from '../../../components/Input/Input';
import { RequestResolver } from '../../../helpers/RequestResolver';
import styles from './ChannelEdit.styles';
import { perror } from '../../../helpers/SmartPrint';

class ChannelEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
      inputs: [],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('channel/update/');
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('ChannelEdit', error);
    }
  }


  submitHandlerChange(event) {
    const { inputs } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      console.log('Отправить можно');
    }
    else {
      console.log('Invalid input');
    }
    event.preventDefault();
  };

  submitHandlerDelete(event) {
    console.log('Удаляю');
    event.preventDefault();
  };

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
    let status = <div>Загружается</div>;
    if (isLoaded) {
      status = <div>Загрузилось</div>;
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
          <h2>Настройки канала</h2>
          {Inputs}
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            style={styles.button}
            onClick={event => this.submitHandlerChange(event)}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Изменить
          </Fab>
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            style={styles.button}
            onClick={event => this.submitHandlerDelete(event)}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Удалить канал
          </Fab>
        </form>
        {status}
      </div>
    );
  }
}

ChannelEdit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelEdit);

