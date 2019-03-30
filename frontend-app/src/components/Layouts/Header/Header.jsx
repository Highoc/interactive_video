import React from 'react';
import classes from './Header.module.css';

export const Header = props => (
  <div className={classes.default}>
    { props.children }
  </div>
);