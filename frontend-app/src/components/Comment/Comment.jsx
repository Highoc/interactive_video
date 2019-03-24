import React, { Component } from 'react';

import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import path from '../../Backend';
import Button from '@material-ui/core/Button';

const styles = {
  container: {
    marginLeft: '800px',
  },
};

export class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentId: props.commentId,
      isLoaded: false,
    };
  }

  componentDidMount() {
    const { commentId } = this.state;


    const url = `http://${path}/comment/get/${commentId}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);
        this.setState({ isLoaded: true, comment: result.data });
      },
    ).catch(error => console.log(error));

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
          <Typography component="p">
            {comment.text}
            <div style={styles.container}>
              <Button onClick={(event) => this.onReply(event)} color="primary">
                Ответить
              </Button>
            </div>
          </Typography>
          {comment.children.map(childId => <Comment commentId={childId} callback={this.props.callback} />)}
        </CardContent>
      </Card>
      </div>

    );
  }
}