import React, { Component } from 'react';
import {
  Card, CardHeader, CardContent, Typography, Avatar, Button,
} from '@material-ui/core';
import { RequestResolver } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';
import classes from './Comment.module.css';

export class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentId: props.commentId,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { commentId } = this.state;
      const result = await this.backend().get(`comment/get/${commentId}/`);
      this.setState({ isLoaded: true, comment: result.data });
    } catch (error) {
      perror('Comment', error);
    }
  }

  onReply(event) {
    const { callback } = this.props;
    callback(this.state);
    event.preventDefault();
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    const { comment } = this.state;

    return (
      <div>
        <Card>
          <CardHeader
            title={comment.author}
            subheader={new Date(comment.created).toLocaleDateString('en-EN', dateOptions)}
            avatar={
              <Avatar src="https://hb.bizmrg.com/interactive_video/public_pic/1.jpg" />
            }
          />
          <CardContent>
            <Typography>
              {comment.text}
              <Button onClick={(event) => this.onReply(event)} color="primary" className={classes.container}>
                Ответить
              </Button>
            </Typography>
            {comment.children.map(childId => <Comment commentId={childId} callback={this.props.callback} key={childId} />)}
          </CardContent>
        </Card>
      </div>
    );
  }
}
