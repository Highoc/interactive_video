import React from 'react';
import classes from './Footer.module.css';

export const Footer = props => (
  <div className={classes.default}>
    { props.children }
  </div>
);