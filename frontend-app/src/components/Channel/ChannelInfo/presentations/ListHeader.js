import React from 'react';
import { Typography } from '@material-ui/core';
import '../HomeList.scss';

const ListHeader = ({ header }) => (
  <div className="list-title">
    <Typography variant="h1">{header}</Typography>
  </div>
);

export default ListHeader;
