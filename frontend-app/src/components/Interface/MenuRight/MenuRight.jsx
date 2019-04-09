import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';

import {
  Drawer, Divider, Typography, List,
} from '@material-ui/core';
import MainListItems from './MainListItems';
import menuRightStyles from './MenuRight.styles';

class MenuRight extends Component {
  render() {
    const { classes } = this.props;


    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          anchor="right"
          classes={{
            paperAnchorDockedRight: classNames(classes.drawerPaper),
          }}
          open={true}
        >
          <List disablePadding>
            <Typography variant="h4" align="center" color="textSecondary">
              Действия
            </Typography>
            <Divider />
            <MainListItems />
          </List>
          <Divider />
        </Drawer>
      </div>
    );
  }
}

MenuRight.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(menuRightStyles)(MenuRight);

