import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  withStyles,
} from '@material-ui/core';

import { RequestResolver } from '../../../helpers/RequestResolver';
import styles from './styles';
import { perror } from '../../../helpers/SmartPrint';

import { addChannel } from '../../../store/actions/authorization';
import { ServerForm } from '../../../components/Forms';

class CreateChannel extends Component {
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
      this.setState({ isLoaded: true, inputs: result.data });
    } catch (error) {
      perror('CreateChannel', error);
    }
  }

  onSubmitSuccess(data) {
    const { addChannel } = this.props;
    addChannel(data.key);
    this.setState({ isSent: true, channelKey: data.key });
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

CreateChannel.propTypes = {
  classes: PropTypes.object.isRequired,
  addChannel: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
});

const mapDispatchToProps = dispatch => ({
  addChannel: channelKey => dispatch(addChannel(channelKey)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CreateChannel));
