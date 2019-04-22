import React, { Component } from 'react';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';

import {Typography, withStyles} from "@material-ui/core";
import Channel from '../../components/Search/Channel/Channel';
import Video from '../../components/Search/Video/Video';


import styles from './styles';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      info: null,
      videoList: [],
      channelList: [],
    };
    this.backend = RequestResolver.getGuest();
  }

  async componentDidMount() {
    try {
      const { location } = this.props;
      const result = await this.backend().get(`core/search/${location.search}`);
      this.setState({ channelList: result.data.channel_list, videoList: result.data.video_list, isLoaded: true });
      pprint('info', result.data);
    } catch (error) {
      perror('HomePage', error);
    }
  }

  async componentWillReceiveProps(nextProps, nextContext) {
    try {
      const { location } = nextProps;
      const result = await this.backend().get(`core/search/${location.search}`);
      this.setState({ channelList: result.data.channel_list, videoList: result.data.video_list, isLoaded: true });
      pprint('info', result.data);
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const { classes } = this.props;
    const { isLoaded, videoList, channelList } = this.state;

    if (!isLoaded) {
      return <div />;
    }

    const videos = videoList.map(video => (
      <Video video={video} />
    ));

    const channels = channelList.map(channel => (
      <Channel channel={channel} />
    ));


    return (
      <div className={classes.root}>
        <Typography variant="h4" color="textSecondary" className={classes.title}>
          Видео
        </Typography>
        {videos}
        <Typography variant="h4" color="textSecondary" className={classes.title}>
          Каналы
        </Typography>
        {channels}
      </div>
    );
  }
}

export default withStyles(styles)(Search);
