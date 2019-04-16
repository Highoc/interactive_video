import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Card, CardContent, CardActionArea, CardMedia, Typography, withStyles,
} from '@material-ui/core';

import ChannelPlaylistView from '../../../components/Playlist/ChannelPlaylistView';

import { json, RequestResolver } from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';

import styles from './styles';


class PlaylistAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelKey: props.channelKey,
      isLoaded: false,
      playlists: [],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { channelKey } = this.state;
      const result = await this.backend().get(`channel/${channelKey}/playlist/all/`);
      pprint('PlaylistAll', result.data);
      this.setState({ isLoaded: true, playlists: result.data });
    } catch (error) {
      perror('PlaylistAll', error);
    }
  }

  async componentWillReceiveProps(nextProps, nextContext) {
    const { channelKey: oldChannelKey } = this.props;
    const { channelKey } = nextProps;
    if (oldChannelKey !== channelKey) {
      try {
        const result = await this.backend().get(`channel/${channelKey}/playlist/all/`);
        pprint('PlaylistAll', result.data);
        this.setState({ isLoaded: true, playlists: result.data, channelKey });
      } catch (error) {
        perror('PlaylistAll', error);
      }
    }
  }

  async onDelete(key) {
    const { playlists, channelKey } = this.state;
    const updatedPlaylists = playlists.filter(elem => elem.key !== key);
    this.setState({ playlists: updatedPlaylists });
    try {
      await this.backend(json).post(`channel/${channelKey}/playlist/${key}/delete/`, {});
    } catch (error) {
      perror('PlaylistAll', error);
    }
  }

  render() {
    const { isLoaded, playlists, channelKey } = this.state;
    const { myChannelKey, classes } = this.props;
    if (!isLoaded) {
      return <div />;
    }

    let addPlaylist;
    if (myChannelKey === channelKey) {
      const AddPlaylist = props => <Link to={`/channel/${channelKey}/playlist/create`} {...props} />;

      addPlaylist = (
        <div className={classes.container}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                component={AddPlaylist}
                className={classes.media}
                title="Добавить плейлист"
                image="https://get.wallhere.com/photo/red-cross-cross-red-hospital-1231489.jpg"
              />
              <CardContent className={classes.newContent}>
                <Typography gutterBottom variant="h6" component="h2" align="center">
                  Новый Плейлист
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      );
    }

    return (
      <div>
        {
          playlists.map(playlist => (
            <div className={classes.container} key={playlist.key}>
              <ChannelPlaylistView
                playlist={playlist}
                channelKey={channelKey}
                key={playlist.key}
                onDelete={(key) => { this.onDelete(key); }}
              />
            </div>
          ))
        }
        {addPlaylist}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  myChannelKey: state.authorization.channelKey,
});

export default withStyles(styles)(connect(mapStateToProps)(PlaylistAll));

PlaylistAll.propTypes = {
  myChannelKey: PropTypes.string.isRequired,
  channelKey: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};
