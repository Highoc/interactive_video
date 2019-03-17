import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

export class Playlist extends Component {
  constructor(props) {
    super(props);

    const { channelKey, playlistKey } = props.match.params;

    this.state = {
      channelKey,
      playlistKey,
      isLoaded: false,
      playlist: null,
    };
  }

  componentDidMount() {
    const { channelKey, playlistKey } = this.state;

    const url = `http://192.168.1.205:8000/channel/${channelKey}/playlist/${playlistKey}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ isLoaded: true, playlist: result.data });
      },
    ).catch(error => console.log(error));
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Изменить плейлист
    * */
    const { playlist, channelKey } = this.state;
    return (
      <div>
        <h4> Название плейлиста: { playlist.name } </h4>
        <h4> Описание плейлиста: { playlist.description } </h4>
        <h4> Видео: </h4>
        {
          playlist.video.length !== 0
            ? playlist.video.map(video => (
              <div key={video.key}>
                <h4> Название видео: { video.name } </h4>
                <Link to={`/channel/${channelKey}/watch/${video.key}`}>
                  <img style={{ height: '150px' }} src={video.preview_url} />
                </Link>
                <hr />
              </div>))
            : <h4> Пока нет видео </h4>
        }
      </div>
    );
  }
}
