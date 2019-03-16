import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

export class PlaylistAll extends Component {
  constructor(props) {
    super(props);

    const { channelKey } = props.match.params;

    this.state = {
      channelKey,
      isLoaded: false,
      playlists: null,
    };
  }

  componentDidMount() {
    const { channelKey } = this.state;

    const url = `http://localhost:8000/channel/${channelKey}/playlist/all/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ isLoaded: true, playlists: result.data });
      },
    ).catch(error => console.log(error));
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Добавить плейлист
    * Удалить плейлист
    * */
    const { playlists, channelKey } = this.state;
    return (
      <div>
        { playlists.map( playlist => (
          <div key={playlist.key}>
            <h4> Название плейлиста: { playlist.name } </h4>
            <h4> Описание плейлиста: { playlist.description } </h4>
            <Link to={`/channel/${channelKey}/playlist/${playlist.key}`}>
              <img style={{ height: '150px' }} src={playlist.preview_url} />
            </Link>
            <hr />
          </div>
        ))
        }
      </div>
    );
  }
}
