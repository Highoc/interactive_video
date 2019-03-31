import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardActionArea, CardMedia, Typography,
} from '@material-ui/core';
import ChannelPlaylistView from '../../../components/Playlist/ChannelPlaylistView';
import classes from './PlaylistAll.module.css';
import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';

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
      this.setState({ isLoaded: true, playlists: result.data });
    } catch (error) {
      perror('PlaylistAll', error);
    }
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

    const AddPlaylist = props => <Link to={`/channel/${channelKey}/playlist/create`} {...props} />;

    return (
      <div>
        { playlists.map((playlist, i) => (
          <div className={classes.container} key={playlist.key}>
            <ChannelPlaylistView playlist={playlist} channelKey={channelKey} key={playlist.key} />
          </div>
        ))
        }
        <div className={classes.container}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                component={AddPlaylist}
                className={classes.media}
                title="Добавить плейлист"
                image="http://www.clipartbest.com/cliparts/xcg/LA8/xcgLA8a7i.jpg"
              />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h6" component="h2" align="center">
                  Новый Плейлист
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>

    );
  }
}

export default PlaylistAll;
