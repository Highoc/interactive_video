import React, { Component } from 'react';

import { ClientForm, ServerForm } from '../../components/Forms';

const inputs = [{
  type: 'image',
  name: 'avatar',
  previewUrl: 'http://hb.bizmrg.com/interactive_video/profile_avatars/7cf1886021d846ed82d2ec85a1ee5d61?AWSAccessKeyId=quZTPp3V28P7V1SGJRXxvs&Signature=2pNPw6DvF8cMjMaNLW%2BHToKPVR4%3D&Expires=1554410048',
  label: 'Аватар профиля',
  placeholder: 'Выберите аватар пользователя',
  rules: {
    mimetypes: [
      'image/png',
    ],
    max_size: 10485760,
    required: false,
  },
},
{
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
    required: false,
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
        <hr />
        <ClientForm />
      </div>
    );
  }
}

export default Test;
