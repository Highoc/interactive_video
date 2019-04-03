import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import classes from './FileInput.module.css';

export default class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.imageUrl,
      name: '',
      file: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad(event) {
    const url = this.state.url;
    URL.revokeObjectURL(url);
    event.preventDefault();
  }

  handleChange(event) {
    const { callback } = this.props;
    const file = event.target.files[0];
    const nameFile = file.name;
    const url = URL.createObjectURL(file);
    callback(url, event.target.files[0]);
    this.setState({ url, name: nameFile, file });
    event.preventDefault();
  }

  render() {
    const { url, name } = this.state;
    let nameFile = <div>Файл не выбран</div>
    if (name !== '') {
      nameFile = name;
    }
    return (
      <div>
        <div className={classes.previewContainer}>
          <img
            alt="Ваш аватар"
            src={url}
            onLoad={this.handleLoad}
            className={classes.image}
          />
        </div>
        <div className={classes.file_upload}>
          <Button size="small" color="primary" type="button">Выбрать</Button>
          <div>{nameFile}</div>
          <input type="file" onChange={this.handleChange} accept="image/png" />
        </div>
      </div>
    );
  }
}
