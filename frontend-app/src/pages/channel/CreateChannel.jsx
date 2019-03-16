import React, { Component } from 'react';
import axios from 'axios';
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

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      inputs: [],
    };
  }

  componentDidMount() {
    const url = 'http://172.20.10.6:8000/channel/update/';

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ inputs: result.data, isLoaded: true});
      },
    ).catch((error) => {
      console.log(error);
    });
  }

  inputChangedHandler = (event, key) => {
    const updatedInputs = {
      ...this.state.inputs,
      [key]: {
        ...this.state.inputs[key],
        value: event.target.value,
      },
    };

    this.setState({ inputs: updatedInputs });
  };


  render() {
    const { inputs, isLoaded } = this.state;
    let status = <div>Загружается</div>;
    if (isLoaded){
      status = <div>Загрузилось</div>;
    }
    const Inputs = Object.keys(inputs).map((key) => {
      const inputElement = inputs[key];
      return (
        <Input
          key={key}
          elementType={inputElement.type}
          elementName={inputElement.name}
          elementDescription={inputElement.description}
          value={inputElement.value}
          rules={inputElement.rules}
          changed={event => this.inputChangedHandler(event, key)}
        />
      );
    });

    return (
      <div>
        <form>
          <h2>Создание канала</h2>
          {Inputs}
          <button type="submit">Отправить</button>
        </form>
        {status}
      </div>
    );
  }
}

export default CreateChannel;

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


  submitHandler = (event) => {
    event.preventDefault();
    console.log('sent');
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    return isValid;
  }



 */