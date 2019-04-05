import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import {
  ExpansionPanel,  ExpansionPanelDetails, ExpansionPanelSummary, Typography, Button,
} from '@material-ui/core';
import { RequestResolver } from '../../../helpers/RequestResolver';
import date from '../../../helpers/Date/date';
import styles from './ExpansionPanel.styles';
import RatingViews from './RatingViews';
import ExpandMoreIcon from "@material-ui/core/SvgIcon/SvgIcon";

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

  handleChange(expanded) {
    if (expanded) {
      this.setState({
        expanded: false,
      });
    } else {
      this.setState({
        expanded: true,
      });
    }
  }

  render() {
    const {
      classes, created, author, description,
    } = this.props;
    const { expanded, videoKey } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expandIcon={<ExpandMoreIcon color="secondary" />}>
          <ExpansionPanelSummary>
            <div className={classes.row}>
              <div className={classes.columnContainer}>
                <Typography className={classes.ratingViews}>
                  Автор:
                  {author}
                </Typography>
                <Typography className={classes.ratingViews}>
                  Создано:
                  {date(created)}
                </Typography>
              </div>
            </div>
            <div className={classes.row}>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.columnButton}
                onClick={(event) => { event.preventDefault(); this.handleChange(expanded); }}
              >
                Оставить свой комментарий
              </Button>
            </div>

            <RatingViews videoKey={videoKey} />

          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Typography color="secondary">
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

