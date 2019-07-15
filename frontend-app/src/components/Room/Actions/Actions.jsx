import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Typography, withStyles, IconButton,
} from '@material-ui/core';

import {
  Pause, PlayArrow, FiberNew, HighlightOff,
} from '@material-ui/icons';

import styles from './styles';


class Actions extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h1" align="center">Голосовалки</Typography>
        <div className={classes.actions}>
          <div className={classes.column}>
            <div className={classes.line}>
              <IconButton color="secondary" className={classes.button} aria-label="Pause">
                <Pause />
              </IconButton>
              <Typography variant="h5">Пауза</Typography>
            </div>

            <div className={classes.line}>
              <IconButton color="secondary" className={classes.button} aria-label="Play">
                <PlayArrow />
              </IconButton>
              <Typography variant="h5">Начать</Typography>
            </div>
          </div>
          <div className={classes.column}>
            <div className={classes.line}>
              <IconButton color="secondary" className={classes.button} aria-label="New">
                <FiberNew />
              </IconButton>
              <Typography variant="h5">Смена фильма</Typography>
            </div>
            <div className={classes.line}>
              <IconButton color="secondary" className={classes.button} aria-label="Kick">
                <HighlightOff />
              </IconButton>
              <Typography variant="h5">Выгнать</Typography>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withStyles(styles)(Actions);
