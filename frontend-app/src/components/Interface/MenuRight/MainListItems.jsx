import { Link } from 'react-router-dom';
import {
  Divider, ListItem, ListItemIcon, ListItemText, Badge,
} from '@material-ui/core';
import React, { Component } from 'react';
import {
  Videocam, Home, Create, RestorePage, Mail, Notifications, QuestionAnswer,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles/index';
import menuRightStyles from './MenuRight.styles';

class MainListItems extends Component {
  render() {
    const { channelKey, channelExists, classes } = this.props;
    const CreateVideo = props => <Link to={`/channel/${channelKey}/create`} {...props} />;
    const MyChannel = props => <Link to={`/channel/${channelKey}`} {...props} />;
    const CreateChannel = props => <Link to="/channel/create" {...props} />;
    const HomeLink = props => <Link to="/" {...props} />;
    let buttons = (
      <div>
        <ListItem
          button
          component={HomeLink}
        >
          <ListItemIcon><RestorePage color="secondary" /></ListItemIcon>
          <ListItemText
            primary="На главную"
          />
        </ListItem>
        <Divider />
        <ListItem
          button
          component={CreateChannel}
        >
          <ListItemIcon><Create color="secondary" /></ListItemIcon>
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
            component={HomeLink}
          >
            <ListItemIcon><RestorePage color="secondary" /></ListItemIcon>
            <ListItemText
              primary="На главную"
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={MyChannel}
          >
            <ListItemIcon><Home color="secondary" /></ListItemIcon>
            <ListItemText
              primary="Мой канал"
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={CreateVideo}
          >
            <ListItemIcon><Videocam color="secondary" /></ListItemIcon>
            <ListItemText
              primary="Создать видео"
            />
          </ListItem>
          <ListItem
            button
          >
            <ListItemIcon>
              <Badge badgeContent={10} max={999} color="primary">
                <Mail color="secondary" />
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary="Сообщения"
            />
          </ListItem>
          <ListItem
            button
          >
            <ListItemIcon>
              <Badge badgeContent={17} color="primary">
                <Notifications color="secondary" />
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary="Уведомления"
            />
          </ListItem>
          <ListItem
            button
          >
            <ListItemIcon>
              <Badge badgeContent={5} color="primary">
                <QuestionAnswer color="secondary" />
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary="Ответы"
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

export default withStyles(menuRightStyles)(connect(mapStateToProps)(MainListItems));
