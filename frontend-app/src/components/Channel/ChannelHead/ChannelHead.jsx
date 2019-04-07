import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardActionArea, CardMedia, Typography, AppBar, Tab, Tabs,
} from '@material-ui/core';

import VideoIcon from '@material-ui/icons/OndemandVideo';
import PlaylistIcon from '@material-ui/icons/PlaylistPlay';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { connect } from 'react-redux';
import date from '../../../helpers/Date/date';
import { perror } from '../../../helpers/SmartPrint';
import classes from './ChannelHead.module.css';
import { RequestResolver, json } from '../../../helpers/RequestResolver';

class ChannelHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.channel,
      channelKey: props.channelKey,
      subStatus: props.channel.subscription.is_active,
      value: 0,
    };
    this.backend = RequestResolver.getBackend();
  }

  async handleSubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      await this.backend(json).post(`channel/${channelKey}/subscribe/`, {});
      this.setState({ subStatus: true });
    } catch (error) {
      perror('ChannelHead', error);
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  async handleUnsubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      await this.backend(json).post(`channel/${channelKey}/unsubscribe/`, {});
      this.setState({ subStatus: false });
    } catch (error) {
      perror('ChannelHead', error);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value } = this.state;
    const { callbackValue } = this.props;
    if (prevState.value !== value) {
      callbackValue(value);
    }
  }

  render() {
    const {
      channel, channelKey, subStatus, value,
    } = this.state;
    const { myChannelKey } = this.props;
    const Settings = props => <Link to={`${channelKey}/edit`} {...props} />;
    let subscribe = <Tab label="Подписаться" icon={<ThumbUp />} onClick={event => this.handleSubscribe(event)} />;
    let settings = <Tab label="Настройки" icon={<SettingsIcon />} component={Settings} />;
    if (myChannelKey !== channelKey) {
      settings = <div />;
    }
    if (subStatus) {
      subscribe = <Tab label="Отписаться" icon={<ThumbDown />} onClick={event => this.handleUnsubscribe(event)} />;
    }

    return (
      <Card className={classes.card} color="primary">
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image="http://sonoiocazzo.altervista.org/wp-content/uploads/2017/04/cropped-697297-1.jpg"
            title={channel.name}
          />
          <AppBar position="static" color="primary">
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="secondary"
              centered
            >
              <Tab label="Видео" icon={<VideoIcon />} />
              <Tab label="Плейлисты" icon={<PlaylistIcon />} />
              <Tab label="О канале" icon={<HelpIcon />} />
              {settings}
              {subscribe}
            </Tabs>
          </AppBar>
          {this.props.children}
        </CardActionArea>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  myChannelKey: state.authorization.channelKey,
});

export default connect(mapStateToProps)(ChannelHead);
