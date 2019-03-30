import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import {
  Button, Drawer,
} from '@material-ui/core';
import VideoCamera from '@material-ui/icons/Videocam';
import rightStyles from './ConstructPanelRight.styles';

export class ConstructPanelRight extends Component {
  onReply(event, choice) {
    const { callback } = this.props;
    callback(choice);
    event.preventDefault();
  }

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
          open
        >
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large" onClick={event => this.onReply(event, 1)}>
              Добавить узел
            </Button>
          </div>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} size="large" onClick={event => this.onReply(event, 2)}>
              Удалить узел
            </Button>
          </div>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" className={classes.button} onClick={event => this.onReply(event, 3)}>
              Создать видео
              <VideoCamera fontSize="large" />
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

ConstructPanelRight.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(rightStyles)(ConstructPanelRight);
