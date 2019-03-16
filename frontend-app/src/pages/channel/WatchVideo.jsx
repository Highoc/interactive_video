import React, { Component } from 'react';
import axios from 'axios';
import { InteractivePlayer } from '../../components/InteractivePlayer';

const textStyles = {
  position: 'relative',
  overflow: 'hidden',
  paddingLeft: '5%',
  paddingRight: '5%',
};

export class WatchVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: statuses.NOT_LOADED,
      video: null,
    };
  }

  componentDidMount() {
    const { videoKey } = this.props.match.params;
    const url = `http://localhost:8000/video/get/${videoKey}/`;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);

        this.setState({ status: statuses.LOADED, video: result.data });
      },
    ).catch((error) => {
      console.log(error);
      this.setState({ status: statuses.ERROR });
    });
  }

  render() {
    const { status, video } = this.state;

    let result = null;
    if (status === statuses.LOADED) {
      result = (
        <div style={textStyles}>
          Название: { video.name } <br />
          Создано : { video.created } <br />
          Описание: { video.description } <br />
          Комментарии: <ul>{ video.head_comments.map(commentId => <Comment commentId={commentId} />)}</ul>
          <InteractivePlayer main={video.head_video_part} codec={video.codec} />
        </div>
      );
    } else if (status === statuses.NOT_LOADED) {
      result = <div>Not loaded</div>;
    } else {
      result = <div>Error</div>;
    }

    return result;
  }
}

class Comment extends Component {
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
        console.log(result.data);
        this.setState({ isLoaded: true, comment: result.data });
      },
    ).catch(error => console.log(error));
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

    const { comment } = this.state;
    return (
      <li>
        {comment.author}> {comment.text}
        <ul>
          {comment.children.map(childId => <Comment commentId={childId} />)}
        </ul>
      </li>
    );
  }
}

const statuses = {
  LOADED: 1,
  NOT_LOADED: 2,
  ERROR: 3,
};
