import React, { Component } from 'react';

import {
  IconButton,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Settings, ExitToApp } from '@material-ui/icons';
import {
  Chat, TextInfo, Members, Actions, Title,
} from '../../components/Room';
import InteractivePlayer from '../../components/VideoWatch/InteractivePlayer/InteractivePlayer';
import styles from './styles';
import { time } from '../../helpers/Date/date';
import picturePatch from '../../static/images/channelPatch.png';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const messageList = [
      {
        owner: 'Vasya', text: 'Hello Guys!', time: time(1563108917273), avatar: picturePatch,
      },
      {
        owner: 'Bob', text: 'Hello Vasya!', time: time(1563122917273), avatar: picturePatch,
      },
      {
        owner: 'Max', text: 'Hello Bob+Vasya!', time: time(1563132917273), avatar: picturePatch,
      },
      {
        owner: 'Vasya', text: 'Hello Guys!', time: time(1563222917273), avatar: picturePatch,
      },
      {
        owner: 'Bob', text: 'Hello Vasya!', time: time(1563232917273), avatar: picturePatch,
      },
    ];
    const roomInfo = { rules: 'Не пукать в ладошку, а если пукнешь бан, а так в целом можно пукать с удовольствием', name: 'Комната для знатного пердежа' };
    const members = [
      { name: 'Ivan', avatar: picturePatch },
      { name: 'Danil', avatar: picturePatch },
      { name: 'Poper', avatar: picturePatch },
      { name: 'Petr', avatar: picturePatch },
      { name: 'Bobr', avatar: picturePatch },
    ];
    return (
      <div className={classes.main_container}>
        <Title name={roomInfo.name} />
        <div className={classes.main_components}>
          <Chat messageList={messageList} />
          <InteractivePlayer main="https://hb.bizmrg.com/interactive_video/public_test/part1_dashinit.mp4" codec="video/mp4" />
        </div>
        <div className={classes.secondary_components}>
          <TextInfo rules={roomInfo.rules} />
          <Members members={members} />
          <Actions />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Test);
