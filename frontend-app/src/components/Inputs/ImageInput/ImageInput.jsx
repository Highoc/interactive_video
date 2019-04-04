import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Card } from '@material-ui/core';

import classes from './ImageInput.module.css';


class ImageInput extends Component {
  static defaultProps = {
    placeholder: 'Выберите изображение',
    previewUrl: '',
    value: null,
  };

  static checkValidity(value, rules) {
    const result = {
      isValid: false,
      error: '',
    };

    if (!value) {
      if (rules.required) {
        result.error = 'Это обязательное поле';
      } else {
        result.isValid = true;
      }
      return result;
    }

    if (rules.mimetypes) {
      const mimetype = rules.mimetypes.find(elem => elem === value.type);
      if (!mimetype) {
        result.error = 'Некорректный формат изображения (допустимый формат - png)';
        return result;
      }
    }

    if (rules.max_size) {
      if (value.size > rules.max_size) {
        result.error = 'Изображение слишком велико';
        return result;
      }
    }

    result.isValid = true;
    return result;
  }

  constructor(props) {
    super(props);
    const validation = ImageInput.checkValidity(props.value, props.rules);
    this.state = {
      name: props.name,
      value: props.value,

      placeholder: props.placeholder,
      previewUrl: props.previewUrl,

      isValid: validation.isValid,
      error: validation.error,

      isTouched: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value } = this.state;
    const { onStateChange } = this.props;
    if (prevState.value !== value) {
      onStateChange(this.state);
    }
  }

  onLoad(event) {
    const { previewUrl } = this.state;
    URL.revokeObjectURL(previewUrl);
    event.preventDefault();
  }

  onChange(event) {
    const { rules } = this.props;
    const file = event.target.files[0];
    const filename = file.name;
    const previewUrl = URL.createObjectURL(file);

    const { isValid, error } = ImageInput.checkValidity(file, rules);
    this.setState({
      value: file, isValid, error, previewUrl, isTouched: true, placeholder: filename,
    });

    event.preventDefault();
  }

  render() {
    const { label, placeholder } = this.props;
    const {
      previewUrl, isValid, isTouched, error,
    } = this.state;

    const isCorrect = !isTouched || isValid;

    return (
      <Card className={classes.imageInput}>
        {label}
        <div className={classes.previewContainer}>
          <img
            alt=""
            src={previewUrl}
            onLoad={event => this.onLoad(event)}
            className={classes.image}
          />
        </div>
        <div className={classes.file_upload}>
          <Button size="small" color="primary" type="button">Выбрать</Button>
          <div>{placeholder}</div>
          <input type="file" onChange={event => this.onChange(event)} accept="image/*" />
        </div>
      </Card>
    );
  }
}

export default ImageInput;

ImageInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  rules: PropTypes.object.isRequired,
  previewUrl: PropTypes.string,
  onStateChange: PropTypes.func.isRequired,
};
