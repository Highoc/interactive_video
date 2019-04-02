import React, { Component } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { DialogContent } from '@material-ui/core';
import Comment from './Comment';

import { RequestResolver, json } from '../../../helpers/RequestResolver';
import { pprint, perror } from '../../../helpers/SmartPrint';

import {
  subscribeToChannel as subscribe,
  unsubscribeFromChannel as unsubscribe,
} from '../../../store/actions/centrifugo';

import Dialog from '../../Dialog';
import Input from '../../Input/Input';


class CommentBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelKey: props.channelKey,
      videoKey: props.videoKey,

      commentsId: props.commentsId,
      comments: [],
      level: props.level,

      dialogOpen: false,
      inputs: [],
    };

    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const {
        channelKey, videoKey, level, commentsId,
      } = this.state;

      const { subscribeToChannel } = this.props;

      const promises = commentsId.map(
        commentId => this.backend().get(`comment/list/${commentId}/level/${level}/`),
      );

      const results = await Promise.all(promises);
      pprint('CommentBox', results);

      const result = await this.backend().get(`channel/${channelKey}/video/${videoKey}/comment/add/`);
      pprint('CommentBox', result);

      const comments = [];
      results.map(
        elem => comments.push(elem.data),
      );

      this.setState({ comments, inputs: result.data });

      subscribeToChannel(`video/${videoKey}/comments`, comment => this.onUpdate(comment));
    } catch (error) {
      perror('CommentBox', error);
    }
  }

  componentWillUnmount() {
    const { videoKey } = this.state;
    const { unsubscribeFromChannel } = this.props;
    unsubscribeFromChannel(`video/${videoKey}/comments`);
  }

  onUpdate(data) {
    const { comments } = this.state;
    const comment = this.findCommentById(comments, data.parent_id);
    if (comment != null) {
      if (!comment.children.length || comment.children[0] !== '...') {
        comment.children.push(data);
      }
    }
    this.setState({ comments });
  }

  onReply(commentId) {
    this.setState({ dialogOpen: true, currentId: commentId });
  }

  async onLoad(commentId) {
    const { comments, level } = this.state;
    const result = await this.backend().get(`comment/list/${commentId}/level/${level}/`);
    pprint('CommentBox', result);

    const comment = this.findCommentById(comments, commentId);
    if (comment != null) {
      comment.children = result.data.children;
    }

    this.setState({ comments });
  }

  async onSubmit() {
    const { inputs, channelKey, videoKey } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      this.setState({ dialogOpen: false });
      try {
        const data = this.getData();
        await this.backend(json).post(`channel/${channelKey}/video/${videoKey}/comment/add/`, data);
      } catch (error) {
        perror('CommentBox', error);
      }
      this.setState({ currentId: null });
    } else {
      perror('CommentBox', 'Invalid inputs');
    }
  }

  getData() {
    const { inputs, currentId } = this.state;
    const result = {};
    inputs.map((input) => { result[input.name] = input.value; });
    result.parent_id = currentId;
    return result;
  }

  findCommentById(comments, id) {
    let comment = null;
    for (const elem of comments) {
      if (elem === '...') {
        break;
      }

      if (elem.id === id) {
        return elem;
      }

      comment = this.findCommentById(elem.children, id);
      if (comment != null) {
        break;
      }
    }
    return comment;
  }

  callbackInput(data) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === data.name);
    input.value = data.value;
    input.isValid = data.isValid;
    this.setState({ inputs });
  }

  render() {
    const { comments, inputs, dialogOpen } = this.state;

    const Inputs = Object.keys(inputs).map((key) => {
      const inputElement = inputs[key];
      return (
        <Input
          key={key}
          type={inputElement.type}
          name={inputElement.name}
          description={inputElement.description}
          value={inputElement.value}
          rules={inputElement.rules}
          callback={data => this.callbackInput(data)}
        />
      );
    });

    return (
      <div>
        <div>
          {
            comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={id => this.onReply(id)}
                onLoad={id => this.onLoad(id)}
              />
            ))
          }
        </div>
        <Dialog dialogOpen={dialogOpen} callback={() => this.onSubmit()} title="Ответ на комментарий">
          <DialogContent>
            {Inputs}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  isReady: state.centrifugo.isInitialised,
});

const mapDispatchToProps = dispatch => ({
  subscribeToChannel: (channel, callback) => dispatch(subscribe(channel, callback)),
  unsubscribeFromChannel: channel => dispatch(unsubscribe(channel)),
});


CommentBox.propTypes = {
  channelKey: PropTypes.string.isRequired,
  videoKey: PropTypes.string.isRequired,
  commentsId: PropTypes.array.isRequired,
  level: PropTypes.number.isRequired,
  subscribeToChannel: PropTypes.func.isRequired,
  unsubscribeFromChannel: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);
