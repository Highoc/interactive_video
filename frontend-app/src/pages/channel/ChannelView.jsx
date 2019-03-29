import React, { Component } from 'react';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import ChannelPlaylist from '../../components/ChannelPlaylist';
import { RequestResolver } from '../../helpers/RequestResolver';
import ChannelHead from '../../components/ChannelHead';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
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
    this.state = {
      channelKey: props.match.params.channelKey,
      channel: null,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { channelKey } = this.state;
      const result = await this.backend().get(`channel/get/${channelKey}/`);
      this.setState({ isLoaded: true, channel: result.data });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.match.params.channelKey !== this.props.match.params.channelKey) {
      this.setState({ channelKey: nextProps.match.params.channelKey, isLoaded: false });
    }
  }

  async componentWillUpdate(nextProps, nextState, snapshot) {

    if (nextProps.match.params.channelKey !== this.props.match.params.channelKey) {
      try {
        const result = await this.backend().get(`channel/get/${nextProps.match.params.channelKey}/`);
        this.setState({ isLoaded: true, channel: result.data });
      } catch (error) {
        console.log(error);
      }
    }
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
