import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link } from 'react-router-dom';

import { Typography, Avatar, withStyles } from '@material-ui/core';
import { Visibility, ThumbUp } from '@material-ui/icons';

import picturePatch from '../../../static/images/channelPatch.png';
import playButton from '../../../static/images/play_circle_outline_white_128x128.png';

import styles from './styles';


class HugeVideoPreview extends Component {
  static defaultProps = {
    order: 'default',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      video, order, classes,
    } = this.props;

    const { channel } = video;

    return (
      <div className={classes.root}>
        {
          order === 'default' ? (
            <div className={classes.columnImg}>
              <Link to={`/channel/${channel.key}/watch/${video.key}`}>
                <img
                  alt="img"
                  src={video.preview_url}
                  className={classes.img}
                >
                </img>
                <div className={classes.overlay}>
                  <div className={classes.button}>
                    <img alt="play" src={playButton} />
                  </div>
                </div>
              </Link>
            </div>

          ) : <div />
        }
        <div className={classes.columnText}>
          <div className={classes.name}>
            <Typography color="textSecondary">{video.name}</Typography>
          </div>
          <div className={classNames(classes.channel, classes.row)}>
            <Avatar alt="Remy Sharp" src={picturePatch} />
            <Link to={`/channel/${channel.key}`} style={{ textDecoration: 'none' }}>
              <Typography className={classes.channelName}>{channel.name}</Typography>
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
        {
          order === 'reverse' ? (
            <div className={classes.columnImg}>
              <Link to={`/channel/${channel.key}/watch/${video.key}`}>
                <img
                  alt="img"
                  src={video.preview_url}
                  className={classes.img}
                >
                </img>
                <div className={classes.overlay}>
                  <div className={classes.button}>
                    <img alt="play" src={playButton} />
                  </div>
                </div>
              </Link>
            </div>

          ) : <div />
        }
      </div>
    );
  }
}

export default withStyles(styles)(HugeVideoPreview);

HugeVideoPreview.propTypes = {
  video: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    preview_url: PropTypes.string,
    created: PropTypes.string,
    rating: PropTypes.number,
    views: PropTypes.number,
    channel: PropTypes.shape({
      name: PropTypes.string,
      key: PropTypes.string,
    }),
    key: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
  order: PropTypes.string,
};
