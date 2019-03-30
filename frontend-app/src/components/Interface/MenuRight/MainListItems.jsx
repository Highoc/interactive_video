import { Link } from 'react-router-dom';
import {
  Divider, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import React from 'react';
import VideoCamera from '@material-ui/icons/Videocam';
import HomeIcon from '@material-ui/icons/Home';
import Page from '@material-ui/icons/RestorePage';


const CreateVideo = props => <Link to="/channel/adminadmin00/create" {...props} />;
const MyChannel = props => <Link to="/channel/adminadmin00" {...props} />;
const Home = props => <Link to="/" {...props} />;

const mainListItems = (
  <div>
    <ListItem
      button
      component={MyChannel}
      key="button1"
    >
      <ListItemIcon><HomeIcon /></ListItemIcon>
      <ListItemText
        primary="My channel"
      />
    </ListItem>
    <Divider />
    <ListItem
      button
      component={Home}
      key="button2"
    >
      <ListItemIcon><Page /></ListItemIcon>
      <ListItemText
        primary="На главную"
      />
    </ListItem>
    <Divider />
    <ListItem
      button
      component={CreateVideo}
      key="button3"
    >
      <ListItemIcon><VideoCamera /></ListItemIcon>
      <ListItemText
        primary="Create Video"
      />
    </ListItem>
  </div>
);
export default mainListItems;