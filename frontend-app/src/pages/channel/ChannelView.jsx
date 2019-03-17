import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

export class ChannelView extends Component {
  constructor(props) {
    super(props);

    const { channelKey } = props.match.params;

    this.state = {
      channelKey,
      channel: null,
      isLoaded: false,
    };
  }

  componentDidMount() {
    const { channelKey } = this.state;
    console.log(channelKey);
    const url = `http://192.168.1.205:8000/channel/get/${channelKey}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ isLoaded: true, channel: result.data });
      },
    ).catch(error => console.log(error));
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Создать / Изменить / Удалить канал
    * */
    const { channel, channelKey } = this.state;
    return (
      <div>
        <h4> Название канала: { channel.name } </h4>
        <h4> Описание канала: { channel.description } </h4>
        <h4> Автор канала: { channel.owner.username } </h4>
        <h4> Канал создан: { channel.created } </h4>
        <h4><Link to={`${channelKey}/playlist/all`}> Посмотреть все плейлисты </Link></h4>
        <hr />
        <h4> Загруженные видео: </h4>
        { channel.uploaded_playlist.video.map(video => (
          <div key={video.key}>
            <h4> Название видео: { video.name } </h4>
            <Link to={`/channel/${channelKey}/watch/${video.key}`}>
              <img style={{ height: '150px' }} src={video.preview_url} />
            </Link>
          </div>
        )) }
      </div>
    );
  }
}
