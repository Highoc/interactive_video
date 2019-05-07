import React, { Component } from 'react';
import { IconButton, Typography } from '@material-ui/core';
import {
  TrendingDown, TrendingUp, Grade, Visibility,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles/index';
import classNames from 'classnames';
import styles from './ExpansionPanel.styles';
import { perror, pprint } from '../../../helpers/SmartPrint';
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
      pprint('RatingViews', response);
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
    const button = (
      <div className={classes.buttons}>
        <IconButton
          color="secondary"
          onClick={() => this.onReply(1)}
          disabled={choice === 1}
        >
          <TrendingUp fontSize="default" />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => this.onReply(-1)}
          disabled={choice === -1}
        >
          <TrendingDown fontSize="default" />
        </IconButton>
      </div>
    );
    return (
      <div className={classes.columnSpace}>
        <div className={classes.line}>
          <Typography className={classes.ratingViews} variant="h5">
            <div className={classNames(classes.rating, classes.row)}>
              <Grade color="secondary" />
              <Typography className={classes.statistics}>
Рейтинг:
                {ratingCounter}
              </Typography>
            </div>
          </Typography>
          {button}
        </div>
        <Typography className={classes.ratingViews} variant="h5">
          <div className={classNames(classes.rating, classes.row)}>
            <Visibility color="secondary" />
            <Typography className={classes.statistics}>
Просмотров:
              {viewsCounter}
            </Typography>
          </div>
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isReady: state.centrifugo.isInitialised,
  isAuthorized: state.authorization.isAuthorized,
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
