import { Link } from 'react-router-dom';
import {
  Divider, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import React, { Component } from 'react';
import VideoCamera from '@material-ui/icons/Videocam';
import HomeIcon from '@material-ui/icons/Home';
import CreateIcon from '@material-ui/icons/Create';
import Page from '@material-ui/icons/RestorePage';
import { connect } from 'react-redux';


class MainListItems extends Component {
  render() {
    const { channelKey, channelExists } = this.props;
    const CreateVideo = props => <Link to={`/channel/${channelKey}/create`} {...props} />;
    const MyChannel = props => <Link to={`/channel/${channelKey}`} {...props} />;
    const CreateChannel = props => <Link to="/channel/create" {...props} />;
    const Home = props => <Link to="/" {...props} />;
    let buttons = (
      <div>
        <ListItem
          button
          component={Home}
        >
          <ListItemIcon><Page color="secondary" /></ListItemIcon>
          <ListItemText
            primary="На главную"
          />
        </ListItem>
        <Divider />
        <ListItem
          button
          component={CreateChannel}
        >
          <ListItemIcon><CreateIcon color="secondary" /></ListItemIcon>
          <ListItemText
            primary="Создать канал"
          />
        </ListItem>
      </div>
    );

    if (channelExists) {
      buttons = (
        <div>
          <ListItem
            button
            component={Home}
          >
            <ListItemIcon><Page color="secondary" /></ListItemIcon>
            <ListItemText
              primary="На главную"
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={MyChannel}
          >
            <ListItemIcon><HomeIcon color="secondary" /></ListItemIcon>
            <ListItemText
              primary="My channel"
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={CreateVideo}
          >
            <ListItemIcon><VideoCamera color="secondary" /></ListItemIcon>
            <ListItemText
              primary="Create Video"
            />
          </ListItem>
        </div>
      );
    }
    return buttons;
  }
}

const mapStateToProps = state => ({
  channelKey: state.authorization.channelKey,
  channelExists: state.authorization.channelExists,
});

export default connect(mapStateToProps)(MainListItems);
