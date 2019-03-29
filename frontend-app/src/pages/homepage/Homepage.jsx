import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import ChannelPlaylist from '../../components/ChannelPlaylist';
import { backend as path } from '../../urls';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
    marginTop: '2%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
});


class Homepage extends Component {
  constructor(props) {
    super(props);

    const channelKey = 'adminadmin00';

    this.state = {
      channelKey,
      channel: null,
      isLoaded: false,
    };
  }

  async componentDidMount() {
    const channelKey = 'adminadmin00';
    try {
      const url = `http://${path}/channel/get/${channelKey}/`;
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      };
      const result = await axios.get(url, config);
      this.setState({ isLoaded: true, channel: result.data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { isLoaded } = this.state;
    const { classes } = this.props;
    let result;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Создать / Изменить / Удалить канал
    * */
    const { channel, channelKey } = this.state;

    if (isLoaded) {
      result = (
        <div className={classes.root}>
          <Typography className={classes.heading} variant="h4">
            Тренды:
          </Typography>
          <div>
            <ChannelPlaylist playlist={channel.uploaded_playlist} channelKey={channelKey} />
          </div>
          <div>
            <Typography className={classes.heading} variant="h4">
              Подписки:
            </Typography>
          </div>
          <div>
            <ChannelPlaylist playlist={channel.uploaded_playlist} channelKey={channelKey} />
          </div>
        </div>
      );
    }
    else {
      result = <div> Еще не загружено </div>;
    }

    return (
      result
    );
  }
}

Homepage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Homepage);
