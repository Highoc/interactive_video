import React, { Component } from 'react';
import clone from 'clone';
import Tree from 'react-d3-tree';
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

  handleSubmit1() {
    axios.post(
      'http://localhost:8000/channel/adminadmin00/subscribe/', {},
    )
      .then(result => console.log(result.data))
      .catch(error => console.log(JSON.stringify(error)));
  }

  handleSubmit2() {
    axios.post(
      'http://localhost:8000/channel/adminadmin00/unsubscribe/', {},
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(result => console.log(result.data))
      .catch(error => console.log(JSON.stringify(error)));
  }

  render() {
    return (
      <div>
        <form name="test">
          <input name="username" type="text" />
          <input name="password1" type="password" />
          <input name="password2" type="password" />
          <button onClick={this.handleSubmit}>ШЛИ!</button>
        </form>
        <button onClick={() => this.handleSubmit1()}>Activate</button>
        <button onClick={() => this.handleSubmit2()}>Deactivate</button>
      </div>
    );
  }
}
