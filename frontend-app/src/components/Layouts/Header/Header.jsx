import React from 'react';
import classes from './Header.module.css';

const HeaderLayout = props => (
  <div className={classes.default}>
    { props.children }
  </div>
);

export default HeaderLayout;