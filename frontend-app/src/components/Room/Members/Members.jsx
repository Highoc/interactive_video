import React from 'react';
import {
  Avatar, Grid, Typography, withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import styles from './styles';

const Members = props => (
  <div className={props.classes.members}>
    <Typography variant="h1" align="center">Участники</Typography>
    <Grid container justify="center" alignItems="center">
      {props.members.map(member => (
        <Avatar alt="Remy Sharp" src={member.avatar} className={props.classes.avatar} />
      ))}
      <Avatar className={props.classes.greenAvatar}>
        <AddIcon />
      </Avatar>
    </Grid>
  </div>
);

export default withStyles(styles)(Members);


Members.propTypes = {
  members: PropTypes.object.isRequired,
};
