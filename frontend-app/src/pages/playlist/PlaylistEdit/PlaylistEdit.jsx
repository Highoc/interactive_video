import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core';

import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';

import { ServerForm } from '../../../components/Forms';

import styles from './styles';


class PlaylistEdit extends Component {
  constructor(props) {
    super(props);
    const { channelKey, playlistKey } = props.match.params;
    this.state = {
      inputs: [],
      channelKey,
      playlistKey,
      isSent: false,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const { channelKey, playlistKey } = this.state;
    try {
      const result = await this.backend().get(`channel/${channelKey}/playlist/${playlistKey}/update/`);
      pprint('PlaylistEdit', result.data);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('PlaylistEdit', error);
    }
  }

  onSubmitSuccess(data) {
    this.setState({ isSent: true });
  }

  render() {
    const {
      inputs, isSent, channelKey, playlistKey, isLoaded,
    } = this.state;
    const { classes } = this.props;

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}`} />;
    }

    if (!isLoaded) {
      return <div className={classes.root}>Не загружено</div>;
    }

    return (
      <div>
        <ServerForm
          action={`channel/${channelKey}/playlist/${playlistKey}/update/`}
          enctype="multipart/form-data"
          name="playlist-update"
          inputs={inputs}
          onSubmitSuccess={data => this.onSubmitSuccess(data)}
        />
      </div>
    );
  }
}

PlaylistEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistEdit);
