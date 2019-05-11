import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, CardContent, Card, Typography, Avatar,
} from '@material-ui/core';

import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './styles';
import date from '../../../helpers/Date/date';
import picturePatch from '../../../static/images/channelPatch.png';

class VideoCard extends Component {

  render() {
    const { classes, video } = this.props;
    const {
      name, description, created, preview_url, key, channel,
    } = video;

    return (
      <Card className={classes.card}>
        <Link to={`/channel/${channel.key}/watch/${key}`}>
          <img
            alt="img"
            className={classes.cover}
            src={preview_url}
          />
        </Link>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5" className={classes.name}>
              {name}
            </Typography>
            <div className={classNames(classes.channel, classes.row)}>
              <Avatar alt="Remy Sharp" src={picturePatch} />
              <Link
                to={`/channel/${channel.key}`}
                style={{
                  textDecoration: 'none',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  fontSize: 20,
                  color: 'rgb(255,255,255)',
                  margin: '12px 5px 10px 15px',
                  fontFamily: 'Helvetica Neue Cyr Medium',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '1',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                >
                  { channel.name }
                </div>
              </Link>
            </div>
            <div className={classes.description}>
              <div style={{
                fontSize: 20,
                color: 'rgb(124,124,124)',
                lineHeight: '1.5',
                fontFamily: 'Helvetica Neue Cyr Medium',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              >
                {description}
              </div>
            </div>
            <Typography variant="h2" color="textSecondary" className={classes.created}>
              Создано:
              {' '}
              {date(created)}
            </Typography>
          </CardContent>
        </div>
      </Card>
    );
  }
}

VideoCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VideoCard);
