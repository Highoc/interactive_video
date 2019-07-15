import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import styles from './styles';
import PropTypes from "prop-types";

const TextInfo = props => (
  <div className={props.classes.info}>
    <Typography variant="h1" align="center">Правила</Typography>
    <div className={props.classes.infoText}>
      {props.rules}
    </div>
  </div>
);

export default withStyles(styles)(TextInfo);


TextInfo.propTypes = {
  rules: PropTypes.string.isRequired,
};
