import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link } from 'react-router-dom';

import { Typography, Avatar, withStyles } from '@material-ui/core';
import { Visibility, Grade } from '@material-ui/icons';
import date from '../../../helpers/Date/date';

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
    if (!video.preview_url) {
      video.preview_url = 'https://disima.ru/wp-content/uploads/2016/01/chelovek-muravej-art.jpg';
    }

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
                />
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
            <div style={{
              fontSize: 30,
              color: 'rgb(124,124,124)',
              lineHeight: '1.5',
              margin: '10px 5px 10px 5px',
              fontFamily: 'Helvetica Neue Cyr Medium',
              display: '-webkit-box',
              webkitBoxOrient: 'vertical',
              webkitLineClamp: '3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            >
              {video.name}
            </div>
          </div>
          <div className={classNames(classes.channel, classes.row)}>
            <Avatar alt="Remy Sharp" src={picturePatch} />
            <Link
              to={`/channel/${channel.key}`}
              style={{
                textDecoration: 'none',
                margin: '0px 5px 10px 5px',
                overflow: 'hidden',
              }}
            >
              <div style={{
                fontSize: 20,
                color: 'rgb(255,255,255)',
                margin: '12px 5px 10px 15px',
                fontFamily: 'Helvetica Neue Cyr Medium',
                display: '-webkit-box',
                webkitBoxOrient: 'vertical',
                webkitLineClamp: '1',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              >
              { channel.name }
              </div>
            </Link>
          </div>
          <div className={classes.created}>
            <Typography>{`Создано: ${date(video.created)}`}</Typography>
          </div>
          <div className={classNames(classes.rating, classes.row)}>
            <Grade color="secondary" />
            <Typography className={classes.statistics}>{video.rating}</Typography>
          </div>
          <div className={classNames(classes.rating, classes.row)}>
            <Visibility color="secondary" />
            <Typography className={classes.statistics}>{video.views}</Typography>
          </div>
          <div className={classes.description}>
            <div style={{
              fontSize: 20,
              color: 'rgb(255,255,255)',
              lineHeight: '1.5',
              margin: '10px 5px 10px 5px',
              fontFamily: 'Helvetica Neue Cyr Medium',
              display: '-webkit-box',
              webkitBoxOrient: 'vertical',
              webkitLineClamp: '6',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            >
              {video.description}
            </div>
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
                />
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
