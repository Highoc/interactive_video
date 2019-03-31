import React, { Component } from 'react';
import ChannelPlaylist from '../../../components/Channel/ChannelInfo/ChannelPlaylist';
import { RequestResolver } from '../../../helpers/RequestResolver';
import ChannelHead from '../../../components/Channel/ChannelHead';
import classes from './ChannelView.module.css';
import { perror } from '../../../helpers/SmartPrint';

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
      perror('ChannelView', error);
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
        perror('ChannelView', error);
      }
    }
  }

  render() {
    const { isLoaded } = this.state;
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

export default ChannelView;
