import React from 'react';
import classes from './Left.module.css';

export const Left = props => (
  <div className={classes.default}>
    { props.children }
  </div>
);
