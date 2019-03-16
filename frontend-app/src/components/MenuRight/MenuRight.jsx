import React, { Component } from 'react';
import {Link, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';

import IconButton from '@material-ui/core/IconButton';
import VideoCamera from '@material-ui/icons/Videocam';
import CreateVideo from "../../pages/channel/CreateVideo";

const elements = [
  {
    id: 'elements',
    children: [
      { id: 'My channel', icon: <HomeIcon />, active: true },
      { id: 'Notifications', icon: <NotificationsIcon />, active: true },
      { id: 'Comments', icon: <MailIcon />, active: true },
    ],
  },
];

const styles = theme => ({
  root: {
    padding: '5px',
    float: 'right',
    width: '15%',
    height: '600px',
  },
  categoryHeader: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 30,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
});

class MenuRight extends Component {
  render() {
    const { classes, ...other } = this.props;

    return (
      <div className={classes.root}>
        <List disablePadding>
          {elements.map(({ id, children }) => (
            <React.Fragment key={id}>
              <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}
                >
                  {id}
                </ListItemText>
              </ListItem>
              {children.map(({ id: childId, icon, active }) => (
                <ListItem
                  button
                  dense
                  key={childId}
                  className={classNames(
                    classes.item,
                    classes.itemActionable,
                    active && classes.itemActiveItem,
                  )}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                      textDense: classes.textDense,
                    }}
                  >
                    {childId}
                  </ListItemText>
                </ListItem>
              ))}
              <Divider className={classes.divider} />
            </React.Fragment>
          ))}
        </List>
        <IconButton color="primary" className={classes.button} component="span" >
          <VideoCamera fontSize="large"/>
        </IconButton>
        <br />
        <Link to="/channel/1/watch/12deadbeef21"> Watch me 1 ! </Link>
        <br />
        <Link to="/channel/1/watch/21deadbeef12"> Watch me 2 ! </Link>
        <br />
        <Link to="/">Home</Link>
        <br />
        <Link to="/channel/1/create">Create Video </Link>
        <br />
        <Link to="/channel/create">Create Channel </Link>
      </div>
    );
  }
}

MenuRight.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuRight);
