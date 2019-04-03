import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardActionArea, CardMedia, Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import ChannelPlaylistView from '../../../components/Playlist/ChannelPlaylistView';
import classes from './PlaylistAll.module.css';
import {json, RequestResolver} from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';

class PlaylistAll extends Component {
  constructor(props) {
    super(props);
    const { channelKey } = props.match.params;
    this.state = {
      channelKey,
      isLoaded: false,
      playlists: null,
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

  async handleDelete(key) {
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
    const { myChannelKey } = this.props;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

    const AddPlaylist = props => <Link to={`/channel/${channelKey}/playlist/create`} {...props} />;

    let addPlaylist = (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component={AddPlaylist}
              className={classes.media}
              title="Добавить плейлист"
              image="http://www.clipartbest.com/cliparts/xcg/LA8/xcgLA8a7i.jpg"
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
    if (myChannelKey !== channelKey) {
      addPlaylist = <div />;
    }


    return (
      <div>
        {playlists.map((playlist, i) => (
          <div className={classes.container} key={playlist.key}>
            <ChannelPlaylistView
              playlist={playlist}
              channelKey={channelKey}
              key={playlist.key}
              onDelete={(key) => { this.handleDelete(key); }}
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

export default connect(mapStateToProps)(PlaylistAll);
