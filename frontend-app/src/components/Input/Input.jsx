import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
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


class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      rules: this.props.rules,
    };
  }

  render() {
    let inputElement = null;
    let labelValue = 'Not-required';
    if (this.props.rules.required) {
      labelValue = 'Required';
    }

    switch (this.props.type) {
      case ('text'):
        inputElement = (
          <TextField
            error={!this.props.valid}
            required={this.props.rules.required}
            onChange={this.props.changed}
            label={labelValue}
            fullWidth
            value={this.props.value}
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
            error={!this.props.valid}
            multiline
            fullWidth
            rows="6"
            required={this.props.rules.required}
            onChange={this.props.changed}
            label={labelValue}
            value={this.props.value}
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
            required={this.props.rules.required}
            onChange={this.props.changed}
            label={labelValue}
            fullWidth
            value={this.props.value}
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
