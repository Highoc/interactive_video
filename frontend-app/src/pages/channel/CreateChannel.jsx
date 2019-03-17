import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import Input from '../../components/Input/Input';
/*
state={
  controls: {
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'name',
        placeholder: 'Имя канала',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    description: {
      elementType: 'textarea',
      elementConfig: {
        type: 'text',
        placeholder: 'Описание канала',
      },
      value: '',
      validation: {
        required: true,
        maxLength: 4096,
      },
      valid: false,
      touched: false,
    },
  },
*/


const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {

  }
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
          isValid: false,
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
          isValid: false,
        }],
      response: {},
    };
  }

  componentDidMount() {
    const url = 'http://172.20.10.6:8000/channel/update/';
    /*
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ inputs: result.data, isLoaded: true });
      },
    ).catch((error) => {
      console.log(error);
    });*/
  }


  submitHandler(event) {
    const { inputs } = this.state;
    let checkValid = true;
    for (const key in inputs)
    {
      console.log(event);
      inputs[key].valid = this.checkValidity(event.target.value, inputs[key].rules);
      checkValid = checkValid && inputs[key].valid;
    }
    console.log(checkValid);

    if (checkValid) {
      console.log(inputs);
    }
    else {
      console.log('Invalid input');
    }
    event.preventDefault();
  };

  callbackInput(state){
    console.log(state.name);
    console.log(state.value);
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
          <h2>Создание канала</h2>
          {Inputs}
          <Fab variant="extended"
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
        {status}
      </div>
    );
  }
}

CreateChannel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateChannel);

/*
const response = [
  {
    type: 'input',
    name: 'name',
    value: '',
    description: 'Название канала',
    rules: [],
  },
  {
    type: 'textarea',
    name: 'description',
    value: '',
    description: 'Описание канала',
    rules: [],
  },
];
*/


/*

    inputChangedHandler = (event, key) => {
    const updatedInputs = {
      ...this.state.inputs,
      [key]: {
        ...this.state.inputs[key],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[key].validation),
        touched: true,
      },
    };







 */
