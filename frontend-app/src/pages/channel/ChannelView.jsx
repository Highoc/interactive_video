import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";

import ChannelPlaylist from '../../components/ChannelPlaylist';

import ChannelHead from '../../components/ChannelHead';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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


class ChannelView extends Component {
  constructor(props) {
    super(props);

    const { channelKey } = props.match.params;

    this.state = {
      channelKey,
      channel: null,
      isLoaded: false,
    };
  }

  componentDidMount() {
    const { channelKey } = this.state;

    const url = `http://192.168.1.205:8000/channel/get/${channelKey}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ isLoaded: true, channel: result.data });
      },
    ).catch(error => console.log(error));
  }

  render() {
    const { isLoaded } = this.state;
    const { classes } = this.props;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Создать / Изменить / Удалить канал
    * */
    const { channel, channelKey } = this.state;
    return (
      <div className={classes.root}>
        <ChannelHead channel={channel} channelKey={channelKey} />
        <ChannelPlaylist playlist={channel.uploaded_playlist} channelKey={channelKey} />
      </div>
    );
  }
}

ChannelView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelView);