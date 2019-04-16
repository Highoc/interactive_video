import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, CardContent, Card, Typography, Avatar,
} from '@material-ui/core';

import styles from './styles';
import picturePatch from '../../../static/images/channelPatch.png';
import channelPatch from '../../../static/images/ava.png';

import classNames from "classnames";
import {Link} from "react-router-dom";

class ChannelCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, channel } = this.props;
    const { name, description, key } = channel;

    return (
      <Card className={classes.card}>
        <Link to={`/channel/${key}`}>
          <img
            alt="img"
            className={classes.cover}
            src={ channelPatch }
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
                to={`/channel/${key}`}
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
                  webkitBoxOrient: 'vertical',
                  webkitLineClamp: '1',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                >
                  { name }
                </div>
              </Link>
            </div>
            <Typography variant="h2" color="textSecondary" className={classes.description}>
              {description}
            </Typography>
          </CardContent>
        </div>
      </Card>
    );
  }
}

ChannelCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelCard);

