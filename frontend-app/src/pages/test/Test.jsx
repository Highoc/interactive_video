import React, { Component } from 'react';

import { ClientForm, ServerForm } from '../../components/Forms';
import PropTypes from "prop-types";

const inputs = [{
  type: 'image',
  name: 'avatar',
  previewUrl: '',
  label: 'Аватар пользователя',
  placeholder: 'Выберите аватар пользователя',
  rules: {
    mimetypes: [
      'image/png',
    ],
    max_size: 10485760,
    required: true,
  },
}, {
  type: 'choice',
  name: 'playlist',
  value: '11',
  choices: [{ text: 'Playlist A', value: '1' }, { text: 'Playlist B', value: '11' }, { text: 'Playlist C', value: '21' }],
  label: 'Плейлист интерактивного видео',
  rules: {
    required: true,
  },
}, {
  type: 'video',
  name: 'content',
  label: 'Видеофрагмент пользователя',
  placeholder: 'Выберите видеофрагмент',
  rules: {
    mimetypes: [
      'video/mp4',
    ],
    max_size: 10485760,
    required: true,
  },
}, {
  type: 'text',
  name: 'first_name',
  value: 'hacker',
  label: 'Имя',
  placeholder: 'Напишите имя пользователя',
  rules: {
    max_length: 16,
    required: true,
  },
},
{
  type: 'text',
  name: 'last_name',
  value: '',
  label: 'Фамилия',
  placeholder: 'Напишите фамилию пользователя',
  rules: {
    max_length: 16,
    required: true,
  },
},
{
  type: 'email',
  name: 'email',
  value: 'door0172@gmail.com',
  label: 'Почтовый адрес',
  placeholder: 'Напишите почтовый адрес',
  rules: {
    required: true,
  },
}];

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ServerForm
          name="test-server-form"
          inputs={inputs}
          action="/test/"
          enctype="application/json"
        />
      </div>
    );
  }
}

export default Test;
