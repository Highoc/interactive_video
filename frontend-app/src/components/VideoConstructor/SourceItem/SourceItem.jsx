import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Card, CardMedia, CardActionArea, CardActions, Button, CardHeader,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles/index';
import { Settings, Delete, Home } from '@material-ui/icons';
import styles from './styles';


class SourceItem extends Component {
  render() {
    const { classes, video } = this.props;
    const NotReady = props => <Link to="/notready" {...props} />;

    if (!video.preview_url) {
      video.preview_url = 'http://static1.squarespace.com/static/536972a0e4b0849f186edd27/t/53a45789e4b0da604dfac2c0/1403279253353/WTW_Video+Icon.png';
    }
    return (
      <Card className={classes.card}>
        <CardHeader
          title={video.name}
        />
        <CardActionArea>
          <CardMedia
            className={classes.media}
            title={video.name}
            image={video.preview_url}
          />
          <CardActions>
            <Button size="small" color="primary" align="center" component={NotReady}>
              Изменить
              <Settings className={classes.rightIcon} />
            </Button>
            <Button size="small" color="primary" align="center" component={NotReady}>
              Удалить
              <Delete className={classes.rightIcon} />
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(SourceItem);

SourceItem.propTypes = {
  classes: PropTypes.object.isRequired,
  video: PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    preview_url: PropTypes.string,
    content_url: PropTypes.string,
  }).isRequired,
};
