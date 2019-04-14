import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';

import { ServerForm } from '../../../components/Forms';

import styles from './styles';

class ChannelEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      inputs: [],
      channelKey: '',
      isSent: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('channel/update/');
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('ChannelEdit', error);
    }
  }

  onSubmitSuccess(data) {
    const { onEdit } = this.props;
    this.setState({ isSent: true, channelKey: data.key });
    onEdit();
  }

  render() {
    const {
      inputs, isLoaded, isSent, channelKey,
    } = this.state;
    const { classes } = this.props;

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}`} />;
    }

    if (!isLoaded) {
      return <div className={classes.root}>Загружается</div>;
    }

    return (
      <div>
        <ServerForm
          action="channel/update/"
          enctype="multipart/form-data"
          name="channel-create"
          inputs={inputs}
          onSubmitSuccess={data => this.onSubmitSuccess(data)}
        />
      </div>
    );
  }
}

ChannelEdit.propTypes = {
  onEdit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelEdit);
