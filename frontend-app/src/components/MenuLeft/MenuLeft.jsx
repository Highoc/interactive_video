import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PeopleIcon from '@material-ui/icons/People';

const subscriptions = [
  {
    id: 'Subscriptions',
    children: [
      { id: 'Subscriptions List', icon: <PeopleIcon />, active: true },
      { id: 'Channel1', icon: <PermMediaOutlinedIcon />, active: true },
      { id: 'Channel2', icon: <PermMediaOutlinedIcon />, active: true },
      { id: 'Channel3', icon: <PermMediaOutlinedIcon />, active: true },
      { id: 'Channel4', icon: <PermMediaOutlinedIcon />, active: true },
      { id: 'Channel5', icon: <PermMediaOutlinedIcon />, active: true },
      { id: 'Channel6', icon: <PermMediaOutlinedIcon />, active: true },
    ],
  },
];

const styles = theme => ({
  root: {
    padding: '5px',
    float: 'left',
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
    fontSize: 24,
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

class MenuLeft extends Component {
  render() {
    const { classes, ...other } = this.props;

    return (
      <div className={classes.root}>
        <List disablePadding>
          {subscriptions.map(({ id, children }) => (
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
      </div>
    );
  }
}

MenuLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuLeft);
