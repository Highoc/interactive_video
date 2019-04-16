import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { Typography, withStyles } from '@material-ui/core';
import { Visibility, Grade } from '@material-ui/icons';

import styles from './styles';
import playButton from '../../../static/images/play_circle_outline_white_48x48.png';


class SmallVideoPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      video, classes,
    } = this.props;

    const { channel } = video;

    if (!video.preview_url) {
      video.preview_url = 'https://disima.ru/wp-content/uploads/2016/01/chelovek-muravej-art.jpg';
    }

    return (
      <div className={classes.root}>
        <Link to={`/channel/${channel.key}/watch/${video.key}`}>
          <img
            alt="img"
            src={video.preview_url}
            className={classes.img}
          />
          <div className={classes.overlay}>
            <div className={classes.button}>
              <img alt="play" src={playButton} />
            </div>
            <Typography className={classes.name}>{video.name}</Typography>
            <div className={classes.statistics}>
              <div>
                <Grade color="secondary" />
                <Typography className={classes.text}>{video.rating}</Typography>
              </div>
              <div>
                <Visibility color="secondary" />
                <Typography className={classes.text}>{video.views}</Typography>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(SmallVideoPreview);

SmallVideoPreview.propTypes = {
  video: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    preview_url: PropTypes.string,
    created: PropTypes.string,
    rating: PropTypes.number,
    views: PropTypes.number,
    key: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};

