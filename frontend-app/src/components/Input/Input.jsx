import React, { Component, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import classes from './Input.module.css';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

function checkValidity(value, rules) {

  let isValid = true;

  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.max_length) {
    isValid = value.length <= rules.max_length && isValid;
  }

  return isValid;
}

class Input extends Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      this.setState({files})
    };
    this.state = {
      value: props.value,
      rules: props.rules,
      isValid: checkValidity(props.value, props.rules),
      isTouched: false,
      name: props.name,
    };
  }

  componentDidMount() {
    const { callback } = this.props;
    callback(this.state);
  }

  inputChangedHandler(event) {
    const isValid = checkValidity(event.target.value, this.state.rules);
    this.setState({ isValid, value: event.target.value, isTouched: true });
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value } = this.state;
    const { callback } = this.props;
    if (prevState.value !== value) {
      callback(this.state);
    }
  }

  render() {
    let inputElement = null;
    let labelValue = 'Not-required';
    const { rules, value, isValid, isTouched } = this.state;
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
            className={classes.textField}
            name={this.props.name}
            margin="normal"
            variant="outlined"
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
            className={classes.textField}
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
            className={classes.textField}
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

