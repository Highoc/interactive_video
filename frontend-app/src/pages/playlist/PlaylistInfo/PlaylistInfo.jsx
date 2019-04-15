import React, { Component } from 'react';
import {
  Card, CardContent, Typography, withStyles,
} from '@material-ui/core';
import Playlist from '../Playlist/Playlist';
import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';

import styles from './styles';


class PlaylistInfo extends Component {
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
    const { classes } = this.props;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

    const { playlist, channelKey } = this.state;
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h1" color="textSecondary" align="center">
              Название плейлиста: {playlist.name}
            </Typography>
            <Typography variant="h5" align="center">
              {playlist.description}
            </Typography>
            <Playlist playlist={playlist} channelKey={channelKey} />
          </CardContent>
        </Card>
      </div>

    );
  }
}

export default withStyles(styles)(PlaylistInfo);
