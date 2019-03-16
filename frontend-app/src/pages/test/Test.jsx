import React, { Component } from 'react';
import axios from 'axios';

export class Test extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const data = {
      name: 'Azazaza',
      description: 'Zazazaza',
      main: {
        text: '1',
        source_key: '8e29fd3593194b479eed083fc994dfa0',
        children: [{
          text: '2',
          source_key: '8e29fd3593194b479eed083fc994dfa0',
          children: [{
            text: '4',
            source_key: '8e29fd3593194b479eed083fc994dfa0',
          }, {
            text: '5',
            source_key: '8e29fd3593194b479eed083fc994dfa0',
          }],
        }, {
          text: '3',
          source_key: '8e29fd3593194b479eed083fc994dfa0',
        }],
      },
    };

    console.log(data);

    axios.post(
      'http://localhost:8000/video/upload/', data,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(result => console.log(result.data))
      .catch(error => console.log(error));
  }


  render() {
    return (
      <div>
        <button onClick={this.handleSubmit}>ШЛИ!</button>
      </div>
    );
  }
}
