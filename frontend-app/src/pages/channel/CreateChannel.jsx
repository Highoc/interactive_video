import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import Input from '../../components/Input/Input';
import { RequestResolver } from '../../helpers/RequestResolver';


const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});


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
      const result = await this.backend().get('channel/update/');
      this.setState({ isLoaded: true });
    } catch (error) {
      console.log(error);
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
    let Inputs = <div />;
    let result = <div>Загружается</div>;

    if (isLoaded) {
      Inputs = Object.keys(inputs).map((key) => {
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
      result = (
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

    return (
      { result }
    );
  }
}

CreateChannel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateChannel);
