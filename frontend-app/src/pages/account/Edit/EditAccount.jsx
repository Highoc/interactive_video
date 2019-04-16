import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core';

import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror, pprint } from '../../../helpers/SmartPrint';

import { ServerForm } from '../../../components/Forms';

import styles from './styles';


class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
      isSent: false,
      isLoaded: false,
    };

    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('core/profile/update/');
      pprint('EditAccount', result.data);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('EditAccount', error);
    }
  }

  onSubmitSuccess(data) {
    this.setState({ isSent: true });
  }

  render() {
    const { inputs, isSent, isLoaded } = this.state;
    const { classes } = this.props;

    if (isSent) {
      return <Redirect to="/account" />;
    }

    if (!isLoaded) {
      return <div className={classes.root}>Не загружено</div>;
    }

    return (
      <div>
        <ServerForm
          action="core/profile/update/"
          enctype="multipart/form-data"
          name="profile-update"
          inputs={inputs}
          onSubmitSuccess={data => this.onSubmitSuccess(data)}
        />
      </div>
    );
  }
}

EditAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditAccount);
