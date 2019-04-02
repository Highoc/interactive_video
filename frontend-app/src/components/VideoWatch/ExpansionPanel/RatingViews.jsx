import React, { Component } from 'react';
import { IconButton, Typography } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDownSharp';
import ArrowDropUp from '@material-ui/icons/ArrowDropUpSharp';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles/index';
import styles from './ExpansionPanel.styles';
import {perror, pprint} from '../../../helpers/SmartPrint';
import {
  subscribeToChannel as subscribe,
  unsubscribeFromChannel as unsubscribe,
} from '../../../store/actions/centrifugo';
import { RequestResolver } from '../../../helpers/RequestResolver';

const statuses = {
  LOADED: 1,
  NOT_LOADED: 2,
  ERROR: 3,
};

class RatingViews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewsCounter: 0,
      videoKey: props.videoKey,
      status: statuses.NOT_LOADED,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { videoKey } = this.state;
      let response = await this.backend().post(`views/add/${videoKey}/`, {});
      this.setState({ viewsCounter: response.data.counter });

      response = await this.backend().get(`rating/get/${videoKey}/`);
      pprint('eee', response);
      this.setState({ ratingCounter: response.data.counter, choice: response.data.value });

      this.setState({ status: statuses.LOADED });

      const { subscribeToChannel } = this.props;
      subscribeToChannel(`video/${videoKey}/rating`, data => this.updateRatingCounter(data));
      subscribeToChannel(`video/${videoKey}/views`, data => this.updateViewsCounter(data));
    } catch (error) {
      this.setState({ status: statuses.ERROR });
      perror('WatchVideo', error);
    }
  }

  componentWillUnmount() {
    const { unsubscribeFromChannel } = this.props;
    const { videoKey } = this.state;
    unsubscribeFromChannel(`video/${videoKey}/rating`);
    unsubscribeFromChannel(`video/${videoKey}/views`);
  }

  async onReply(choice) {
    const { videoKey } = this.state;
    try {
      this.setState({ choice });
      const result = await this.backend().post(`rating/update/${videoKey}/`, { value: choice });
      pprint('RatingViews', result.data);
    } catch (error) {
      perror('RatingViews', error);
    }
  }

  updateViewsCounter(views) {
    this.setState({ viewsCounter: views.counter });
    pprint('[WatchVideo] Centrifuge', views);
  }

  updateRatingCounter(rating) {
    this.setState({ ratingCounter: rating.counter });
    pprint('[WatchVideo] Centrifuge', rating);
  }

  render() {
    const {
      ratingCounter, viewsCounter, choice, status,
    } = this.state;
    const { classes } = this.props;
    if (status !== statuses.LOADED) {
      return <div />;
    }
    return (
      <div className={classes.row}>
        <div className={classes.columnContainer}>
          <Typography className={classes.ratingViews}>
            Рейтинг:
            {ratingCounter}
          </Typography>
          <Typography className={classes.ratingViews}>
            Просмотров:
            {viewsCounter}
          </Typography>
        </div>
        <div className={classes.columnContainer}>
          <IconButton
            color="secondary"
            onClick={event => this.onReply( 1)}
            disabled={choice === 1}
          >
            <ArrowDropUp fontSize="large" />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={event => this.onReply( -1)}
            disabled={choice === -1}
          >
            <ArrowDropDown fontSize="large" />
          </IconButton>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isReady: state.centrifugo.isInitialised,
});

const mapDispatchToProps = dispatch => ({
  subscribeToChannel: (channel, callback) => dispatch(subscribe(channel, callback)),
  unsubscribeFromChannel: channel => dispatch(unsubscribe(channel)),
});


RatingViews.propTypes = {
  subscribeToChannel: PropTypes.func.isRequired,
  unsubscribeFromChannel: PropTypes.func.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RatingViews));
