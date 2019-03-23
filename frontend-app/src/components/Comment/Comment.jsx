import React, { Component } from 'react';

import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';


export class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = { commentId: props.commentId, isLoaded: false };
  }

  componentDidMount() {
    const { commentId } = this.state;

    const url = `http://localhost:8000/comment/get/${commentId}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        // console.log(result.data);
        this.setState({ isLoaded: true, comment: result.data });
      },
    ).catch(error => console.log(error));
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
      <Card>
        <CardHeader
          title={comment.author}
          subheader={new Date(comment.created).toLocaleDateString('en-EN', dateOptions)}
          avatar={
            <Avatar src="https://hb.bizmrg.com/interactive_video/public_pic/1.jpg" />
          }
        />
        <CardContent>
          <Typography component="p">
            {comment.text}
          </Typography>
          {comment.children.map(childId => <Comment commentId={childId} />)}
        </CardContent>
      </Card>
    );
  }
}
