import {
  Button, Dialog, DialogActions, DialogTitle,
} from '@material-ui/core';
import React, { Component } from 'react';

class DialogSmart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.dialogOpen === true) {
      this.setState({ dialogOpen: nextProps.dialogOpen });
    }
  }

  async componentWillUpdate(nextProps, nextState, snapshot) {
    if (nextProps.dialogOpen === true && this.state.dialogOpen === false) {
      this.setState({ dialogOpen: true });
    }
  }

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  submitHandler() {
    const { callback } = this.props;
    callback();
    this.setState({ dialogOpen: false });
  }

  render() {
    const { dialogOpen } = this.state;

    return (
      <Dialog
        onClose={this.handleClose}
        open={dialogOpen}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle onClose={this.handleClose}>
          {this.props.title}
        </DialogTitle>
        {this.props.children}
        <DialogActions>
          <Button onClick={(event) => { event.preventDefault(); this.submitHandler(); }} color="secondary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DialogSmart;
