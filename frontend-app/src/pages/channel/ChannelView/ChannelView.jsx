import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card, CardMedia, Typography, Button, withStyles, CardContent,
} from '@material-ui/core';
import {
  OndemandVideo, PlaylistPlay, Settings, Help, ThumbDown, ThumbUp,
} from '@material-ui/icons';

import styles from './styles';

import { json, RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';
import date from '../../../helpers/Date/date';

import { PlaylistAll } from '../../playlist';
import ChannelInfo from '../../../components/Channel/ChannelInfo/ChannelInfo';
import ChannelEdit from '../ChannelEdit/ChannelEdit';
import head from '../../../static/images/head.png';

import { Carousel, HugeVideoPreview } from '../../../components/Video';
import { TabBar } from '../../../components/TabBar';


class ChannelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelKey: props.match.params.channelKey,
      channel: {},
      isLoaded: false,
      subStatus: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async onSubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      await this.backend(json).post(`channel/${channelKey}/subscribe/`, {});
      this.setState({ subStatus: true });
    } catch (error) {
      perror('ChannelHead', error);
    }
  }

  async onUnsubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      await this.backend(json).post(`channel/${channelKey}/unsubscribe/`, {});
      this.setState({ subStatus: false });
    } catch (error) {
      perror('ChannelHead', error);
    }
  }

  componentDidMount() {
    const { channelKey } = this.state;
    this.reload(channelKey);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { channelKey } = this.props.match.params;
    const { channelKey: newChannelKey } = nextProps.match.params;
    if (newChannelKey !== channelKey) {
      this.reload(newChannelKey);
    }
  }

  async reload(channelKey) {
    try {
      const result = await this.backend().get(`channel/get/${channelKey}/`);
      this.setState({
        channel: result.data,
        channelKey,
        isLoaded: true,
        subStatus: result.data.subscription.is_active,
      });
    } catch (error) {
      this.setState({ isLoaded: false });
      perror('ChannelView', error);
    }
  }

  render() {
    const {
      isLoaded, channel, channelKey, subStatus,
    } = this.state;
    const { myChannelKey, classes } = this.props;

    if (!channel.head_picture) {
      channel.head_picture = head;
    }

    let subscribe = (
      <Button
        color="secondary"
        variant="outlined"
        className={classes.subs}
        size="large"
        onClick={event => this.onSubscribe(event)}
      >
        <ThumbUp color="secondary" />
        {' Подписаться'}
      </Button>
    );

    if (subStatus) {
      subscribe = (
        <Button
          color="secondary"
          variant="outlined"
          className={classes.subs}
          size="large"
          onClick={event => this.onUnsubscribe(event)}
        >
          <ThumbDown color="secondary" />
          {' Отписаться'}
        </Button>
      );
    }

    if (!isLoaded) {
      return <div className={classes.root}> Еще не загружено </div>;
    }

    const Info = (
      <Typography>
        Создатель:
        {channel.owner.username}
        <br />
        Создан:
        {date(channel.created)}
        <br />
        {channel.description}
      </Typography>
    );

    const tabs = [
      {
        value: 1,
        label: 'Видео',
        icon: <OndemandVideo />,
        container: <div />,
      }, {
        value: 2,
        label: 'Плейлисты',
        icon: <PlaylistPlay />,
        container: <PlaylistAll channelKey={channelKey} />,
      }, {
        value: 3,
        label: 'О канале',
        icon: <Help />,
        container: <ChannelInfo channel={channel} />,
      },
    ];

    if (myChannelKey === channelKey) {
      const settings = {
        value: 4,
        label: 'Настройки',
        icon: <Settings />,
        container: <ChannelEdit onEdit={() => this.reload(channelKey)} />,
      };
      tabs.push(settings);
      subscribe = null;
    }

    return (
      <div className={classes.root}>
        <Card className={classes.card} color="primary">
          <CardMedia
            className={classes.media}
            image={channel.head_picture}
            title={channel.name}
          />
          <CardContent>
            <div className={classes.row}>
              <Typography gutterBottom variant="h4" color="textSecondary">
                {channel.name}
              </Typography>
              {subscribe}
            </div>
          </CardContent>
          <TabBar defaultValue={1} tabs={tabs} />
        </Card>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  myChannelKey: state.authorization.channelKey,
});

export default withStyles(styles)(connect(mapStateToProps)(ChannelView));

ChannelView.propTypes = {
  myChannelKey: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
