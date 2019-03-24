import React, { Component } from 'react';
import axios from 'axios';

export class Test extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {

    const form = document.forms.test;
    const formData = new FormData(form);

    axios.post(
      'http://localhost:8000/core/user/sign_up/', formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(result => console.log(result.data))
      .catch(error => console.log(JSON.stringify(error)));
    event.preventDefault();
  }


  render() {
    return (
      <form name="test">
        <input name="username" type="text" />
        <input name="password1" type="password" />
        <input name="password2" type="password" />
        <button onClick={this.handleSubmit}>ШЛИ!</button>
      </form>
    );
  }
}
