import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import classes from './VideoInput.module.css';

export default class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Файл не выбран',
      file: null,
    };
  }

  handleChange(event) {
    const { callback } = this.props;
    const file = event.target.files[0];
    this.setState({ name: file.name, file});
    callback(file);
  }

  render() {
    const { name } = this.state;
    return (
      <div>
        <div className={classes.file_upload}>
          <Button size="small" color="primary" type="button">Выбрать</Button>
          <div>{name}</div>
          <input type="file" onChange={event => this.handleChange(event)} accept="video/mp4" />
        </div>
      </div>
    );
  }
}

