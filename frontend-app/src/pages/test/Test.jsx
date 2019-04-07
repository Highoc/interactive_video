import React, { Component } from 'react';

import { ServerForm } from '../../components/Forms';
import { Dialog } from '../../components/Dialog';

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
    this.state = {
      dialogOpen: false,
    };
  }

  onDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  onDialogClose() {
    this.setState({ dialogOpen: false });
  }

  onSubmitSuccess(data) {
    console.log(data);
    this.setState({ dialogOpen: false });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.onDialogOpen()}>Открыть</button>
        <Dialog title="Тестим серверную форму" open={this.state.dialogOpen} onClose={() => this.onDialogClose()}>
          <ServerForm
            name="test-server-form"
            inputs={inputs}
            action="/test/"
            enctype="application/json"
            onSubmitSuccess={(data => this.onSubmitSuccess(data))}
          />
        </Dialog>
      </div>
    );
  }
}

export default Test;
