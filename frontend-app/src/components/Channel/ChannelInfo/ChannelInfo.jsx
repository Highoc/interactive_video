import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
  Card, CardContent, Typography, withStyles,
} from '@material-ui/core';

import styles from './styles';
import date from '../../../helpers/Date/date';


class ChannelInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, channel } = this.props;

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h1" color="textSecondary" align="center">
              Название: { channel.name }
            </Typography>
            <Typography variant="h4" className={classes.text}>
              Автор : { channel.owner.username }
            </Typography>
            <Typography variant="h4" className={classes.text}>
              Создан: { date(channel.created) }
            </Typography>
            <Typography variant="h5" className={classes.text}>
              Описание: { channel.description }
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ChannelInfo);

ChannelInfo.propTypes = {
  channel: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};