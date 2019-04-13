import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dialog, DialogContent, DialogTitle, IconButton, Typography, withStyles,
} from '@material-ui/core';

import { Close as CloseIcon } from '@material-ui/icons';

import styles from './styles';


class SmartDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ open: nextProps.open });
  }

  render() {
    const { open } = this.state;
    const {
      title, children, onClose, classes,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle disableTypography className={classes.root} onClose={onClose}>
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(SmartDialog);

SmartDialog.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
