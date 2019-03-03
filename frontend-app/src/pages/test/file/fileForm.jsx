import React, { Component } from 'react';

// controlled components
export class FileForm extends Component {
  constructor(props) {
    super(props);
    this.state = { url: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad(event) {
    const url = this.state.url;
    URL.revokeObjectURL(url);
    event.preventDefault();
  }

  handleChange(event) {
    const url = URL.createObjectURL(event.target.files[0]);
    this.setState({ url });
    event.preventDefault();
  }

  render() {
    return (
      <div className="file-drop">
        <p>Upload file with the file dialog </p>
        <img onLoad={this.handleLoad} src={this.state.url} />
        <input name="file" type="file" onChange={this.handleChange} />
      </div>
    );
  }
}
