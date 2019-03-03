import React, { Component } from 'react';
import axios from 'axios';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condition: 'not-sent',
      source: null,
      name: '',
      description: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.descriptionChange = this.descriptionChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const file = event.target.files[0]
    this.setState({ source: file, name: file.name });
  }

  nameChange(event) {
    this.setState({ name: event.target.value });
  }

  descriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ condition: 'sending' });

    const { name, description, source } = this.state;

    const formData = new FormData();
    formData.set('name', name);
    formData.set('description', description);
    formData.append('content', source);

    axios.post(
      'http://192.168.1.205:8000/video/upload_source/',
      formData,
      {
        headers: {
          'Authorization': `JWT ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((result) => {
        console.log(result.data);
        this.setState({ condition: 'sent' });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ condition: 'error' });
      });

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div>
          FORM: {this.state.condition}
        </div>
        <form
          onSubmit={this.handleSubmit}
        >
          <input name="description" type="textarea" onChange={this.descriptionChange} />
          <input name="content" type="file" onChange={this.onChange} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
export default Test;
