import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import {
  ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Divider, Avatar,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { RequestResolver } from '../../../helpers/RequestResolver';
import date from '../../../helpers/Date/date';
import styles from './ExpansionPanel.styles';

import RatingViews from './RatingViews';
import picturePatch from '../../../static/images/channelPatch.png';

class ExpansionPanelVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoKey: props.keyVideo,
      expanded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { expanded } = this.state;
    const { openComments } = this.props;
    if (prevState.expanded !== expanded) {
      openComments(this.state);
    }
  }

  render() {
    const {
      classes, video, keyChannel,
    } = this.props;

    const { created, owner, description } = video;
    const { videoKey } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded>
          <ExpansionPanelSummary>
            <div className={classes.row}>
              <div className={classes.columnContainer}>
                <div className={classes.line}>
                  <Avatar alt="Remy Sharp" src={picturePatch} />
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
                    { owner }
                  </div>
                </div>
                <Typography className={classes.ratingViews} variant="h5">
                  Создано: {date(created)}
                </Typography>
                <Typography className={classes.ratingViews} variant="h5">
                  <div className={classes.line}>
                    <Link
                      to={`/channel/${keyChannel}`}
                      style={{
                        textDecoration: 'none',
                        margin: '0px 5px 10px 0px',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        fontSize: 20,
                        color: 'rgb(255,255,255)',
                        margin: '12px 5px 10px 0px',
                        fontFamily: 'Helvetica Neue Cyr Medium',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '1',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      >
                        На канале: {video.channel.name}
                      </div>
                    </Link>
                  </div>
                </Typography>
              </div>
            </div>
            <div className={classes.row}>
            </div>

            <div className={classes.row}>
              <RatingViews videoKey={videoKey} />
            </div>

          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelDetails className={classes.details}>
            <Typography color="secondary" className={classes.description}>
              {description}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

ExpansionPanelVideo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExpansionPanelVideo);
