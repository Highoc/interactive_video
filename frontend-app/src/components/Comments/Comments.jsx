import React, {Component} from "react";
import axios from "axios";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = { commentId: props.commentId, isLoaded: false };
  }

  componentDidMount() {
    const { commentId } = this.state;

    const url = `http://192.168.1.205:8000/comment/get/${commentId}/`;
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

export default Comment;