import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { RequestResolver } from '../../../helpers/RequestResolver';
import ChannelHead from '../../../components/Channel/ChannelHead';
import classes from './ChannelView.module.css';
import { perror } from '../../../helpers/SmartPrint';
import date from '../../../helpers/Date/date';
import PlaylistAll from '../../playlist/PlaylistAll/PlaylistAll';

import ChannelEdit from '../ChannelEdit/ChannelEdit';
import {Carousel, HugeVideoPreview} from "../../../components/Video";

function TabContainer(props) {
  return (
    <div style={{ padding: 8 * 3 }}>
      {props.children}
    </div>
  );
}

class ChannelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelKey: props.match.params.channelKey,
      channel: null,
      isLoaded: false,
      value: 0,
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

  handleValue(value) {
    this.setState({ value });
  }

  render() {
    const { isLoaded } = this.state;

    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    const { channel, channelKey, value } = this.state;
    const info = (<Typography>Создатель:{channel.owner.username}<br />Создан:{date(channel.created)}<br />{channel.description}</Typography>);

    return (
      <div className={classes.root}>
        <ChannelHead channel={channel} channelKey={channelKey} callbackValue={valueChoice => this.handleValue(valueChoice)}>
          {value === 0 && (
          <TabContainer>
            <div>
            </div>
          </TabContainer>
          )}
          {value === 1 && <TabContainer><PlaylistAll channelKey={channelKey} /></TabContainer>}
          {value === 2 && <TabContainer>{info}</TabContainer>}
          {value === 3 && <TabContainer><ChannelEdit /></TabContainer>}
        </ChannelHead>
      </div>
    );
  }
}

export default ChannelView;
