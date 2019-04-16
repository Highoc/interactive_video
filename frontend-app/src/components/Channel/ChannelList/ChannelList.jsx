import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {ListItem, ListItemIcon, ListItemText, Typography} from '@material-ui/core';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';

class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      keyChannel: props.keyChannel,
    };
  }

  render() {
    const { name, keyChannel } = this.state;
    const icon = <PermMediaOutlinedIcon color="secondary" />;
    const ChannelKey = props => <Link to={`/channel/${keyChannel}`} params={{ channelKey: keyChannel }} {...props} />;

    return (
      <ListItem
        button
        component={ChannelKey}
        key={keyChannel}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <Typography style={{
          fontSize: 15,
          color: 'rgb(255,255,255)',
          fontFamily: 'Helvetica Neue Cyr Medium',
          webkitBoxOrient: 'vertical',
          webkitLineClamp: '1',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        >
          {name}
        </Typography>
      </ListItem>
    );
  }
}

export default ChannelList;
