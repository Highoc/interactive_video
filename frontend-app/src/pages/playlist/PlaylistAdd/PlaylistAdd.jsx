import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles/index';

import { Redirect } from 'react-router-dom';

import { perror } from '../../../helpers/SmartPrint';
import { RequestResolver } from '../../../helpers/RequestResolver';
import { ServerForm } from '../../../components/Forms';

import styles from './styles';


class PlaylistAdd extends Component {
  constructor(props) {
    super(props);
    const { channelKey } = props.match.params;
    this.state = {
      inputs: [],
      channelKey,
      isSent: false,
      isLoaded: false,
      newPlaylist: null,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const { channelKey } = this.state;
    try {
      const result = await this.backend().get(`channel/${channelKey}/playlist/create/`);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('PlaylistAdd', error);
    }
  }

  onSubmitSuccess(data) {
    this.setState({ isSent: true, newPlaylist: data.key });
  }

  render() {
    const {
      inputs, isSent, channelKey, isLoaded, newPlaylist,
    } = this.state;
    const { classes } = this.props;

    if (!isLoaded) {
      return <div className={classes.root}>Не загружено</div>;
    }

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}/playlist/${newPlaylist}`} />;
    }

    return (
      <div>
        <ServerForm
          action={`channel/${channelKey}/playlist/create/`}
          enctype="multipart/form-data"
          name="playlist-create"
          inputs={inputs}
          onSubmitSuccess={data => this.onSubmitSuccess(data)}
        />
      </div>
    );
  }
}

PlaylistAdd.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};


export default withStyles(styles)(PlaylistAdd);
