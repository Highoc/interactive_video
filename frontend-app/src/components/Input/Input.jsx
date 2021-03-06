import React, { Component } from 'react';
import {
  TextField,
} from '@material-ui/core';
import classes from './Input.module.css';
import FileInput from './FileInput/FileInput';
import VideoInput from './VideoInput/VideoInput';

function checkValidity(value, rules) {
  let isValid = true;

  if (rules.required) {
    if (value !== undefined) {
      if (!value.type) {
        isValid = value.trim() !== '' && isValid;
      }
    }
  }

  if (rules.min_length) {
    isValid = value.length >= rules.min_length && isValid;
  }

  if (rules.max_length) {
    isValid = value.length <= rules.max_length && isValid;
  }

  if (rules.max_size && value !== undefined) {
    isValid = value.size <= rules.max_size && isValid;
  }

  if (rules.mime_type && value !== undefined) {
    let appropriateFormat = false;
    for (const type in rules.mime_type) {
      if (rules.mime_type[type] === value.type) {
        appropriateFormat = true;
      }
    }
    isValid = appropriateFormat && isValid;
  }

  return isValid;
}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      rules: props.rules,
      isValid: checkValidity(props.value, props.rules),
      isTouched: false,
      name: props.name,
      imageUrl: props.imageUrl,
      file: null,
      source: null,
    };
  }

  componentDidMount() {
    const { callback } = this.props;
    callback(this.state);
  }

  inputChangedHandler(event) {
    const isValid = checkValidity(event.target.value, this.state.rules);
    this.setState({ isValid, value: event.target.value, isTouched: true });
  }

  fileChangedHandler(url, file) {
    const isValid = checkValidity(file, this.state.rules);
    this.setState({ isValid, imageUrl: url, isTouched: true, file });
  }

  videoChangedHandler(file) {
    const isValid = checkValidity(file, this.state.rules);
    this.setState({ isValid, isTouched: true, source: file });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value, imageUrl, source } = this.state;
    const { callback } = this.props;
    if (prevState.value !== value || prevState.imageUrl !== imageUrl || prevState.source !== source) {
      callback(this.state);
    }
  }

  render() {
    let inputElement = null;
    let labelValue = 'Not-required';
    const {
      rules, value, isValid, isTouched, imageUrl,
    } = this.state;
    const isCorrect = !isTouched || isValid;
    if (rules.required) {
      labelValue = 'Required';
    }

    switch (this.props.type) {
      case ('text'):
        inputElement = (
          <TextField
            error={!isCorrect}
            required={rules.required}
            onChange={event => this.inputChangedHandler(event)}
            label={labelValue}
            fullWidth
            value={value}
            placeholder={this.props.description}
            name={this.props.name}
            margin="normal"
            variant="outlined"
          />
        );
        break;
      case ('image'):
        inputElement = (
          <FileInput
            imageUrl={imageUrl}
            callback={(url, file) => this.fileChangedHandler(url, file)}
          />
        );
        break;
      case ('video'):
        inputElement = (
          <VideoInput
            callback={file => this.videoChangedHandler(file)}
          />
        );
        break;

      case ('textarea'):
        inputElement = (
          <TextField
            error={!isCorrect}
            multiline
            fullWidth
            rows="6"
            required={rules.required}
            onChange={event => this.inputChangedHandler(event)}
            label={labelValue}
            value={value}
            placeholder={this.props.description}
            name={this.props.name}
            margin="normal"
            variant="outlined"
          />
        );
        break;
      default:
        inputElement = (
          <TextField
            required={rules.required}
            onChange={event => this.inputChangedHandler(event)}
            label={labelValue}
            fullWidth
            value={value}
            placeholder={this.props.description}
            name={this.props.name}
            margin="normal"
            variant="outlined"
          />
        );
        break;
    }

    return (
      <div className={classes.Input}>
        <label className={classes.Label}>{this.props.description}</label>
        {inputElement}
      </div>
    );
  }
}


export default Input;
