import React from 'react';

import PropTypes from 'prop-types';

import {
  Typography, Avatar, Button, Card, CardHeader, CardContent,
} from '@material-ui/core';

import date from '../../../helpers/Date/date';
import classes from './styles/Comment.module.css';


const Comment = (props) => {
  const {
    onReply, onLoad, comment,
  } = props;

  const {
    id, author, created, text, children, hide_children: hideChildren,
  } = comment;

  let subComments = null;
  if (!hideChildren) {
    subComments = (
      <div>
        {
          children.map(child => (
            <Comment
              key={child.id}
              comment={child}
              onReply={onReply}
              onLoad={onLoad}
            />
          ))
        }
      </div>
    );
  } else {
    subComments = (
      <Button
        onClick={() => onLoad(id)}
        color="primary"
        className={classes.container}
      >
        Больше комментариев
      </Button>
    );
  }

  return (
    <div className={classes.container}>
      <Card>
        <CardHeader
          title={author}
          subheader={date(created)}
          avatar={
            <Avatar src="https://hb.bizmrg.com/interactive_video/public_pic/1.jpg" />
          }
        />
        <CardContent>
          <Typography>
            {text}
            <Button
              onClick={() => onReply(id)}
              color="secondary"
              variant="outlined"
              className={classes.button}
            >
              Ответить
            </Button>
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.children}>
        {subComments}
      </div>
    </div>
  );
};

export default Comment;

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  onLoad: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};
