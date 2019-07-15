import React from 'react';
import { IconButton, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { ExitToApp, Settings } from '@material-ui/icons';
import styles from './styles';

const Title = props => (
  <div className={props.classes.title}>
    <div className={props.classes.row}>
      <Typography variant="h1">{props.name}</Typography>
      <IconButton color="secondary" className={props.classes.settings} aria-label="Settings">
        <Settings />
      </IconButton>
    </div>
    <div className={props.classes.row}>
      <IconButton color="secondary" className={props.classes.exit} aria-label="Exit">
        <ExitToApp />
      </IconButton>
      <Typography variant="h1">Выйти</Typography>
    </div>
  </div>
);

export default withStyles(styles)(Title);


Title.propTypes = {
  name: PropTypes.string.isRequired,
};
