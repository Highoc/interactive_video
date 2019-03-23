import React, { Component } from 'react';

import { connect } from 'react-redux';

import jwt from 'jsonwebtoken';
import Centrifuge from 'centrifuge';

import { centrifugoInit, activateSubscription, deleteSubscription } from '../../actions/centrifugo';

const SECRET = '09a3bbb7-8b2b-445b-b1f4-7913287a3ea5';

class Centrifugo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      centrifuge: new Centrifuge('ws://localhost:80/centrifugo/connection/websocket'),
    };
  }

  componentDidMount() {
    const { userId, centrifuge } = this.state;
    const { centrifugoInit } = this.props;
    const token = jwt.sign({ sub: '1' }, SECRET, { expiresIn: 86400 });

    centrifuge.setToken(token);
    centrifuge.on('connect', () => {
      centrifugoInit();
      console.log('[Centrifuge] Was initialized');
    });

    centrifuge.connect();
  }

  componentWillReceiveProps(nextProps) {
    const { subscriptions } = nextProps;
    for (const elem of subscriptions) {
      if (!elem.isNeeded) {
        const { channel, subscription } = elem;
        subscription.unsubscribe();
        subscription.removeAllListeners();
        nextProps.deleteSubscription(channel);
        console.log(`[Centrifuge] Delete subscription to '${channel}'`);
      } else if (!elem.isActive) {
        const { channel, callback } = elem;
        const subscription = this.subscribeToChannel(channel, callback);
        nextProps.activateSubscription(channel, subscription);
        console.log(`[Centrifuge] Activate subscription to '${channel}'`);
      }
    }
  }

  subscribeToChannel(channel, handlePublish) {
    const { centrifuge } = this.state;
    return centrifuge.subscribe(channel, (message) => {
      handlePublish(message.data);
    });
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({
  subscriptions: state.centrifugo.subscriptions,
});

const mapDispatchToProps = dispatch => ({
  centrifugoInit: () => dispatch(centrifugoInit()),
  activateSubscription: (channel, subscription) => dispatch(activateSubscription(channel, subscription)),
  deleteSubscription: channel => dispatch(deleteSubscription(channel)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Centrifugo);
