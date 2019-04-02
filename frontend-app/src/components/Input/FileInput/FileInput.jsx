import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import classes from './FileInput.module.css';

export default class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.avatar,
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
        <img
          alt="Ваш аватар"
          src={url}
          onLoad={this.handleLoad}
          className={classes.preview}
        />
        <div className={classes.file_upload}>
          <Button size="small" color="primary" type="button">Выбрать</Button>
          <div>{nameFile}</div>
          <input type="file" onChange={this.handleChange} accept="image/*" />
        </div>
      </div>
    );
  }
}

/*
  <div className={classes.contentColumn}>
          <div className={classes.preview} />
          <div className={classes.row}>
            <label className={classes.file_upload}>
              <mark>Файл не выбран</mark>
              <button type="button">Выбрать</button>
              <input type="file" />
            </label>
          </div>
      </div>

  <div className="file-drop">
        <p>Upload file with the file dialog </p>
        <img onLoad={this.handleLoad} src={this.state.url}/>
        <input name="file"  type="file" onChange={ this.handleChange } />
      </div>
 */
