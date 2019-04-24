import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core';


class ControlBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.controlBar}>
        {children}
        Hello
      </div>
    );
  }
}

export default withStyles(styles)(ControlBar);
