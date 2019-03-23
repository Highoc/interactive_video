import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { InteractivePlayer } from '../../components/InteractivePlayer';
import { Comment } from '../../components/Comment/Comment';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { backend as path } from '../../urls';


import {
  subscribeToChannel as subscribe,
  unsubscribeFromChannel as unsubscribe
} from '../../actions/centrifugo';


const textStyles = {
  position: 'relative',
  overflow: 'hidden',
  paddingLeft: '5%',
  paddingRight: '5%',
};

const styles = theme => ({
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  card: {
    width: '100%',
  },
  media: {
    height: 150,
  },
});

const statuses = {
  LOADED: 1,
  NOT_LOADED: 2,
  ERROR: 3,
};

class WatchVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: statuses.NOT_LOADED,
      video: null,
      videoKey: props.match.params.videoKey,
      viewsCounter: 0,
    };
  }

  async componentDidMount() {
    try {
      const { videoKey } = this.state;

      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      };

      let url = `http://${path}/video/get/${videoKey}/`;
      let response = await axios.get(url, config);
      this.setState({ video: response.data });
      console.log(`[WatchVideo] ${JSON.stringify(response.data)}`);

      url = `http://${path}/views/add/${videoKey}/`;
      response = await axios.post(url, {}, config);
      this.setState({ viewsCounter: response.data.counter });
      console.log(`[WatchVideo] ${JSON.stringify(response.data)}`);

      url = `http://${path}/rating/get/${videoKey}/`;
      response = await axios.get(url, config);
      this.setState({ ratingCounter: response.data.counter, yourChoice: response.data.value });
      console.log(`[WatchVideo] ${JSON.stringify(response.data)}`);

      this.setState({ status: statuses.LOADED });

      const { subscribeToChannel } = this.props;
      subscribeToChannel(`video/${videoKey}/comments`, data => console.log(data));
      subscribeToChannel(`video/${videoKey}/rating`, data => this.updateRatingCounter(data));
      subscribeToChannel(`video/${videoKey}/views`, data => this.updateViewsCounter(data));
    } catch (error) {
      this.setState({ status: statuses.ERROR });
      console.log(`[WatchVideo] ${error} ${JSON.stringify(error.response.data)}`);
    }
  }

  componentWillUnmount() {
    const { unsubscribeFromChannel } = this.props;
    const { videoKey } = this.state;
    unsubscribeFromChannel(`video/${videoKey}/comments`);
    unsubscribeFromChannel(`video/${videoKey}/rating`);
    unsubscribeFromChannel(`video/${videoKey}/views`);
  }

  updateViewsCounter(views) {
    this.setState({ viewsCounter: views.counter });
    console.log(`[WatchVideo] Centrifugo > ${JSON.stringify(views)}`);
  }

  updateRatingCounter(rating) {
    this.setState({ ratingCounter: rating.counter });
    console.log(`[WatchVideo] Centrifugo > ${JSON.stringify(rating)}`);
  }

  handleRatingChoice(choice) {
    this.setState({ yourChoice: choice });
    const { videoKey } = this.state;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    const url = `http://${path}/rating/update/${videoKey}/`;
    axios.post(url, { value: choice }, config);
  }

  render() {
    const { status, video, viewsCounter, ratingCounter, yourChoice } = this.state;
    const { classes } = this.props;
    let result = null;
    if (status === statuses.LOADED) {
      result = (
        <div style={textStyles}>
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Название:
                {' '}
                {video.name}
              </Typography>
              <Typography component="p" align="center">
                {video.description}
              </Typography>
            </CardContent>
          </Card>
          <InteractivePlayer main={video.head_video_part} codec={video.codec} />
          <div>Просмотров: { viewsCounter }</div>
          <div>Рейтинг: { ratingCounter }. Твой выбор { yourChoice }.</div>
          <div>
            <button onClick={() => this.handleRatingChoice(1)}>UP</button>
            <button onClick={() => this.handleRatingChoice(0)}>ZERO</button>
            <button onClick={() => this.handleRatingChoice(-1)}>DOWN</button>
          </div>
          <div>Комментарии: { video.head_comments.map(commentId => <Comment commentId={commentId} />)}</div>
        </div>
      );
    } else if (status === statuses.NOT_LOADED) {
      result = <div>Not loaded</div>;
    } else {
      result = <div>Error</div>;
    }

    return result;
  }
}

WatchVideo.propTypes = {
  classes: PropTypes.object.isRequired,
  subscribeToChannel: PropTypes.func.isRequired,
  unsubscribeFromChannel: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isReady: state.centrifugo.isInitialised,
});

const mapDispatchToProps = dispatch => ({
  subscribeToChannel: (channel, callback) => dispatch(subscribe(channel, callback)),
  unsubscribeFromChannel: channel => dispatch(unsubscribe(channel)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WatchVideo));
