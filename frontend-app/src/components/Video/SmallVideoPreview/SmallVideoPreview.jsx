import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link } from 'react-router-dom';

import { Typography, withStyles } from '@material-ui/core';
import { Visibility, ThumbUp } from '@material-ui/icons';

import styles from './styles';
import playButton from '../../../static/images/play_circle_outline_white_48x48.png';

import date from "../../../helpers/Date/date";


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
                <ThumbUp color="secondary" />
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
    channelName: PropTypes.string,
    key: PropTypes.string,
  }).isRequired,
  channelKey: PropTypes.shape().isRequired,
  classes: PropTypes.object.isRequired,
};

/*
   <div className={classes.columnText}>
          <div className={classes.name}>
            <Typography color="textSecondary">{video.name}</Typography>
          </div>
          <div className={classNames(classes.channel, classes.row)}>
            <Avatar alt="Remy Sharp" src={picturePatch} />
            <Link to={`/channel/${channelKey}`} style={{ textDecoration: 'none' }}>
              <Typography className={classes.channelName}>{video.channelName}</Typography>
            </Link>
          </div>
          <div className={classes.created}>
            <Typography>{`Создан: ${video.created}`}</Typography>
          </div>
          <div className={classNames(classes.rating, classes.row)}>
            <ThumbUp color="secondary" />
            <Typography className={classes.statistics}>{video.rating}</Typography>
          </div>
          <div className={classNames(classes.rating, classes.row)}>
            <Visibility color="secondary" />
            <Typography className={classes.statistics}>{video.views}</Typography>
          </div>
          <div className={classes.description}>
            <Typography>{video.description}</Typography>
          </div>
        </div>
 */
