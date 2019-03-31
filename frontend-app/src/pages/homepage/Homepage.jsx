import React, { Component } from 'react';
import ChannelPlaylist from '../../components/Channel/ChannelInfo/ChannelPlaylist';
import Typography from '@material-ui/core/Typography';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import classes from './Homepage.module.css';

class Homepage extends Component {
  constructor(props) {
    super(props);

    const channelKey = 'adminadmin00';
    this.state = {
      channelKey,
      channel: null,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const channelKey = 'adminadmin00';
    try {
      const result = await this.backend().get(`channel/get/${channelKey}/`);
      this.setState({ isLoaded: true, channel: result.data });
      pprint('HomePage', result.data);
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const { isLoaded } = this.state;
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
          <Typography variant="h4">
            Тренды:
          </Typography>
          <div>
            <ChannelPlaylist playlist={channel.uploaded_playlist} channelKey={channelKey} />
          </div>
          <div>
            <Typography variant="h4">
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

export default Homepage;
