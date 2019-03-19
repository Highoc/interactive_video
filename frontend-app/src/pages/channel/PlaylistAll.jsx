import React, { Component } from 'react';
import ChannelPlaylistView from '../../components/ChannelPlaylistView';
import path from '../../Backend';
import axios from 'axios';

const styles = {
  display: 'inline-block',
  width: '300px',
  margin: '5px',
  height: '300px',
};

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

    const url = `http://${path}/channel/${channelKey}/playlist/all/`;
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
        { playlists.map((playlist, i) => (
          <div style={styles}>
            <ChannelPlaylistView playlist={playlist} channelKey={channelKey} key={playlist.key} />
          </div>
        ))
        }
      </div>

    );
  }
}
