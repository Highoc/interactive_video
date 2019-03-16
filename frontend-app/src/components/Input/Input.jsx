import React from 'react';
import classes from './Input.module.css';
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



const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];


  switch (props.type) {
    case ('input'):
      inputElement = (
        <input
          onChange={props.changed}
          className={inputClasses.join(' ')}
          name={props.name}
          placeholder={props.description}
          value={props.value}
        />
      );
      break;

    case ('textarea'):
      inputElement = (
        <textarea
          onChange={props.changed}
          className={inputClasses.join(' ')}
          name={props.name}
          placeholder={props.description}
          value={props.value}
        />
      );
      break;
    default:
      inputElement = (
        <input
          onChange={props.changed}
          className={inputClasses.join(' ')}
          name={props.name}
          placeholder={props.description}
          value={props.value}
        />
      );
      break;
  }


  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default input;