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
import path from '../../Backend';

import { subscribeToChannel, unsubscribeFromChannel } from '../../actions/centrifugo';


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
    };
  }

  componentDidMount() {
    const { subscribeToChannel } = this.props;
    const { videoKey } = this.props.match.params;
    const url = `http://${path}/video/get/${videoKey}/`;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ status: statuses.LOADED, video: result.data });
      },
    ).catch((error) => {
      console.log(error);
      this.setState({ status: statuses.ERROR });
    });


    subscribeToChannel('vasa', data => console.log(data));
    subscribeToChannel('vasa1', data => console.log(data));
    subscribeToChannel('vasa2', data => console.log(data));
  }

  componentWillUnmount() {
    const { unsubscribeFromChannel } = this.props;
    unsubscribeFromChannel('vasa');
    unsubscribeFromChannel('vasa1');
    unsubscribeFromChannel('vasa2');
  }

  // Комментарии: <ul>{ video.head_comments.map(commentId => <Comment commentId={commentId} />)}</ul>
  render() {
    const { status, video } = this.state;
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
};

const mapStateToProps = state => ({
  isInitialised: state.centrifugo.isInitialised,
});

const mapDispatchToProps = dispatch => ({
  subscribeToChannel: (channel, callback) => dispatch(subscribeToChannel(channel, callback)),
  unsubscribeFromChannel: channel => dispatch(unsubscribeFromChannel(channel)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WatchVideo));
