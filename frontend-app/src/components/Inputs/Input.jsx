import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ImageInput, TextInput, VideoInput,
} from '.';


class Input extends Component {
  static defaultProps = {
    value: null,
    previewUrl: '',
    placeholder: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let inputElement;
    const {
      type, name, value, rules, label, placeholder, previewUrl, onStateChange,
    } = this.props;

    switch (type) {
      case ('text'): inputElement = (
        <TextInput
          name={name}
          value={value}
          label={label}
          placeholder={placeholder}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      case ('textarea'): inputElement = (
        <TextInput
          name={name}
          value={value}
          label={label}
          placeholder={placeholder}
          rules={rules}
          multiline
          rows="6"
          onStateChange={onStateChange}
        />
      ); break;

      case ('image'): inputElement = (
        <ImageInput
          name={name}
          label={label}
          placeholder={placeholder}
          previewUrl={previewUrl}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      case ('video'): inputElement = (
        <VideoInput
          name={name}
          label={label}
          placeholder={placeholder}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      default: inputElement = <div />;
    }

    return <div>{inputElement}</div>;
  }
}

export default Input;

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  rules: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  previewUrl: PropTypes.string,
  onStateChange: PropTypes.func.isRequired,
};
