import React, { Component } from 'react';
import {
  Card, CardContent,
} from '@material-ui/core';
import { RequestResolver } from '../../helpers/RequestResolver';
import classes from './Playlist.module.css';
import { perror } from '../../helpers/SmartPrint';



class Playlist extends Component {
  constructor(props) {
    super(props);

    const { channelKey, playlistKey } = props.match.params;

    this.state = {
      channelKey,
      playlistKey,
      isLoaded: false,
      playlist: null,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { channelKey, playlistKey } = this.state;
      const result = await this.backend().get(`channel/${channelKey}/playlist/${playlistKey}/`);
      this.setState({ isLoaded: true, playlist: result.data });
    } catch (error) {
      perror('Playlist', error);
    }
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
        <Card className={classes.card}>
          <CardContent>
            <div />
          </CardContent>
        </Card>
      </div>

    );
  }
}

export default Playlist;
