import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from 'axios';
import Centrifuge from 'centrifuge';

import {
  centrifugoInit as init,
  activateSubscription as activate,
  deleteSubscription as remove,
} from '../../actions/centrifugo';

import { centrifugo, backend } from '../../urls';

class Centrifugo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centrifuge: new Centrifuge(`ws://${centrifugo}/connection/websocket`),
    };
  }

  async componentDidMount() {
    try {
      const url = `http://${backend}/core/centrifugo/token/`;
      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      };

      const response = await axios.get(url, config);
      const token = response.data;

      const { centrifugoInit } = this.props;
      const { centrifuge } = this.state;

      centrifuge.setToken(token);
      centrifuge.on('connect', () => {
        centrifugoInit();
        console.log('[Centrifugo] Was initialized');
        this.checkSubscriptions();
      });

      centrifuge.connect();
    } catch (error) {
      console.log(`[Centrifugo] ${error}`);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkSubscriptions();
  }

  checkSubscriptions() {
    const { subscriptions, deleteSubscription, activateSubscription } = this.props;

    for (const current of subscriptions) {
      if (!current.isNeeded) {
        const { channel, subscription } = current;
        subscription.unsubscribe();
        subscription.removeAllListeners();
        deleteSubscription(channel);
        console.log(`[Centrifugo] Delete subscription to '${channel}'`);
      } else if (!current.isActive) {
        const { channel, callback } = current;
        const subscription = this.subscribeToChannel(channel, callback);
        activateSubscription(channel, subscription);
        console.log(`[Centrifugo] Activate subscription to '${channel}'`);
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
  centrifugoInit: () => dispatch(init()),
  activateSubscription: (channel, subscription) => dispatch(activate(channel, subscription)),
  deleteSubscription: channel => dispatch(remove(channel)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Centrifugo);

Centrifugo.propTypes = {
  subscriptions: PropTypes.array.isRequired,
  centrifugoInit: PropTypes.func.isRequired,
  activateSubscription: PropTypes.func.isRequired,
  deleteSubscription: PropTypes.func.isRequired,
};