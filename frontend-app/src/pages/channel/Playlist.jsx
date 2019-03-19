import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ChannelPlaylist from '../../components/ChannelPlaylist';
import path from '../../Backend';

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
});


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
  }

  componentDidMount() {
    const { channelKey, playlistKey } = this.state;

    const url = `http://${path}/channel/${channelKey}/playlist/${playlistKey}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ isLoaded: true, playlist: result.data });
      },
    ).catch(error => console.log(error));
  }

  render() {
    const { classes } = this.props;
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Изменить плейлист
    * */
    const { playlist, channelKey } = this.state;
    console.log(channelKey, playlist);
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
        <ChannelPlaylist playlist={playlist} channelKey={channelKey} />
      </div>



    );
  }
}

Playlist.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Playlist);



