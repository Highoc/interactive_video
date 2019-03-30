import React from 'react';
import classes from './Main.module.css';

export const Main = props => (
  <div className={classes.default}>
    { props.children }
  </div>
);
