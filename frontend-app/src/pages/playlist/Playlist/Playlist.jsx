import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Card, CardContent, Typography, withStyles,
} from '@material-ui/core';


import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';

import styles from './styles';

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
    const { isLoaded, playlist } = this.state;
    const { classes } = this.props;

    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Название плейлиста:
              {' '}
              {playlist.name}
            </Typography>
            <Typography component="p" align="center">
              {playlist.description}
            </Typography>
          </CardContent>
        </Card>
      </div>

    );
  }
}

export default withStyles(styles)(Playlist);

Playlist.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
