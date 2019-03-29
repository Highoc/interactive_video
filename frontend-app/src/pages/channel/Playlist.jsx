import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ChannelPlaylist from '../../components/ChannelPlaylist';
import { RequestResolver } from '../../helpers/RequestResolver';

const styles = theme => ({
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  card: {
    width: '100%',
    height: '15%',
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
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { channelKey, playlistKey } = this.state;
      const result = await this.backend().get(`channel/${channelKey}/playlist/${playlistKey}/`);
      this.setState({ isLoaded: true, playlist: result.data });
    } catch (error) {
      console.log(error);
    }
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
