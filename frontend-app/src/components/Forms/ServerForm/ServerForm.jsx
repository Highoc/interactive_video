import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';

import Input from '../../Input/Input';
import { perror } from '../../../helpers/SmartPrint';
import { RequestResolver, json, multipart } from '../../../helpers/RequestResolver';


class ServerForm extends Component {
  static defaultProps = {
    onSubmitSuccess: () => {},
    onSubmitFailed: () => {},
    inputsHidden: [],
  };

  static checkValidity(inputs) {
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }
    return isValid;
  }

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,

      inputs: props.inputs,
      inputsHidden: props.inputsHidden,

      isReady: true,
      isValid: false,

      errors: {},
    };

    this.backend = RequestResolver.getBackend();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ inputsHidden: nextProps.inputsHidden });
  }

  async onSubmit() {
    const {
      action, enctype, onSubmitSuccess, onSubmitFailed,
    } = this.props;

    const { name } = this.state;

    let type;
    switch (enctype) {
      case ENCTYPE.JSON: type = json; break;
      case ENCTYPE.MULTIPART: type = multipart; break;
      default: perror(`ServerForm[${name}]`, 'Enctype property is incorrect'); return;
    }

    try {
      const formData = this.getFormData();
      const response = await this.backend(type).post(action, formData);
      onSubmitSuccess(response.data);
    } catch (error) {
      this.setState({ errors: JSON.parse(error.request.response) });
      onSubmitFailed(error);
      perror(`ServerForm[${name}]`, error);
    }
  }

  getFormData() {
    const { inputs, inputsHidden, name } = this.state;
    const { enctype } = this.props;

    const inputsAll = inputs.concat(inputsHidden);

    let formData;
    switch (enctype) {
      case ENCTYPE.JSON:
        formData = {};
        for (const input of inputsAll) {
          formData[input.name] = input.value;
        }
        break;
      case ENCTYPE.MULTIPART:
        formData = new FormData();
        for (const input of inputsAll) {
          formData.append(input.name, input.value);
        }
        break;
      default:
        perror(`ServerForm[${name}]`, 'Enctype property is incorrect');
        formData = {};
    }

    return formData;
  }

  callbackInput(data) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === data.name);
    input.value = data.value;
    input.isValid = data.isValid;
    const isValid = ServerForm.checkValidity(inputs);
    this.setState({ inputs, isValid });
  }

  render() {
    const {
      inputs, errors, isReady, isValid,
    } = this.state;

    let inputList = <div />;
    if (isReady) {
      inputList = inputs.map(input => (
        <Input
          key={input.name}
          type={input.type}
          name={input.name}
          description={input.description}
          value={input.value}
          rules={input.rules}
          callback={data => this.callbackInput(data)}
        />
      ));
    }

    const errorList = Object.keys(errors).map(key => <h3>{`${key}: ${errors[key]}`}</h3>);

    return (
      <div>
        <div>
          {inputList}
        </div>
        <div>
          {errorList}
        </div>
        <Button onClick={() => this.onSubmit()} color="primary" disabled={!isValid}>
          Отправить
        </Button>
      </div>
    );
  }
}

export default ServerForm;

const ENCTYPE = {
  MULTIPART: 'multipart/form-data',
  JSON: 'application/json',
};

ServerForm.propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  enctype: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  inputsHidden: PropTypes.arrayOf(PropTypes.object),
  onSubmitSuccess: PropTypes.func,
  onSubmitFailed: PropTypes.func,
};
