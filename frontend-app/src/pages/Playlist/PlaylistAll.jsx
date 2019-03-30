import React, { Component } from 'react';
import ChannelPlaylistView from '../../components/Playlist/ChannelPlaylistView';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Card from '@material-ui/core/Card/index';
import CardActionArea from '@material-ui/core/CardActionArea/index';
import CardContent from '@material-ui/core/CardContent/index';
import CardMedia from '@material-ui/core/CardMedia/index';
import Typography from '@material-ui/core/Typography/index';
import { RequestResolver } from '../../helpers/RequestResolver';

const styles = theme => ({
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  card: {
    width: '100%',
  },
  media: {
    height: 150,
  },
  container: {
    display: 'inline-block',
    width: '280px',
    margin: '5px',
    height: '280px',
  },
  content: {
    height: '80%',
    width: '90%',
  },
});


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
      console.log(error);
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
    const { classes } = this.props;

    const AddPlaylist = props => <Link to={`/channel/${channelKey}/playlist/create`} {...props} />;

    return (
      <div>
        { playlists.map((playlist, i) => (
          <div className={classes.container}>
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

PlaylistAll.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistAll);
