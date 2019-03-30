import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card, CardMedia, CardContent, CardActionArea, Typography, Button, CardActions,
} from '@material-ui/core';
import classes from './ChannelPlaylistView.module.css';
import { withStyles } from '@material-ui/core/styles/index';

class ChannelPlaylistView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist,
      channelKey: props.channelKey,
    };
  }

  render() {
    const { playlist, channelKey } = this.state;
    const Edit = props => <Link to={`/channel/${channelKey}/playlist/${playlist.key}/update`} {...props} />;
    const chosenPlaylist = props => <Link to={`/channel/${channelKey}/playlist/${playlist.key}`} {...props} />;

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component={chosenPlaylist}
            className={classes.media}
            image={playlist.preview_url}
            title={playlist.name}
          />
          <CardContent className={classes.content}>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              Плейлист:
              {' '}
              {playlist.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" component={Edit}>
              Изменить
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    );
  }
}

export default ChannelPlaylistView;
