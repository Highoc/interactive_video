import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import {
  Drawer, Typography, List, Divider,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RequestResolver } from '../../../helpers/RequestResolver';
import ChannelList from '../../Channel/ChannelList';
import { perror } from '../../../helpers/SmartPrint';
import menuLeftStyles from './MenuLeft.styles';
import {
  subscribeToChannel as subscribe,
  unsubscribeFromChannel as unsubscribe,
} from '../../../store/actions/centrifugo';

class MenuLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      subscriptions: [],
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { subscribeToChannel, id } = this.props;
      let result = await this.backend().get('channel/list/');
      this.setState({ channels: result.data });
      result = await this.backend().get('core/user/subscriptions/');
      this.setState({ subscriptions: result.data });
      subscribeToChannel(`subscriptions#${id}`, data => this.updateSubscriptions(data));
    } catch (error) {
      perror('MenuLeft', error);
    }
  }

  componentWillUnmount() {
    const { unsubscribeFromChannel, id } = this.props;
    unsubscribeFromChannel(`subscriptions#${id}`);
  }

  updateSubscriptions(subscription) {
    const { subscriptions } = this.state;
    if (subscription.is_active) {
      this.setState({subscriptions: [...subscriptions, subscription]});
    }
    else {
      const newSubscriptions = subscriptions.filter(elem => elem.channel_key !== subscription.channel_key);
      this.setState({subscriptions: newSubscriptions});
    }
  }

  render() {
    const { classes } = this.props;
    const { channels, subscriptions } = this.state;
    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          open
        >
          <List className={classes.list} disablePadding>
            <Typography variant="title" align="center">
              Каналы
            </Typography>
            {channels.map(({ name, key }) => (
              <div key={`Channel${key}`}>
                <Divider variant="secondary" />
                <ChannelList name={name} keyChannel={key} />
              </div>
            ))}
            <Divider />
            <Typography variant="title" align="center">
              Подписки
            </Typography>
            {subscriptions.map(({ name, channel_key }) => (
              <div key={`Channel${channel_key}`}>
                <Divider />
                <ChannelList name={name} keyChannel={channel_key} />
              </div>
            ))}
          </List>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isReady: state.centrifugo.isInitialised,
  id: state.authorization.id,
});

const mapDispatchToProps = dispatch => ({
  subscribeToChannel: (channel, callback) => dispatch(subscribe(channel, callback)),
  unsubscribeFromChannel: channel => dispatch(unsubscribe(channel)),
});

MenuLeft.propTypes = {
  subscribeToChannel: PropTypes.func.isRequired,
  unsubscribeFromChannel: PropTypes.func.isRequired,
};

export default withStyles(menuLeftStyles)(connect(mapStateToProps, mapDispatchToProps)(MenuLeft));
