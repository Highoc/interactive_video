import React, { Component } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { Divider } from '@material-ui/core';
import Comment from './Comment';

import { RequestResolver } from '../../../helpers/RequestResolver';
import { pprint, perror } from '../../../helpers/SmartPrint';

import {
  subscribeToChannel as subscribe,
  unsubscribeFromChannel as unsubscribe,
} from '../../../store/actions/centrifugo';

import { Dialog } from '../../Dialog';
import { ServerForm } from '../../Forms';

import classes from './styles/CommentBox.module.css';


class CommentBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelKey: props.channelKey,
      videoKey: props.videoKey,

      commentsId: props.commentsId,
      comments: [],
      level: props.level,
      currentId: null,

      dialogOpen: false,
      inputs: [],
      inputsReady: false,
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

      this.setState({ comments, inputs: result.data, inputsReady: true });

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
    if (!data.parent_id) {
      comments.push(data);
    } else {
      const comment = this.findCommentById(comments, data.parent_id);
      if (comment != null && !comment.hide_children) {
        comment.children.push(data);
      }
    }
    this.setState({ comments });
  }

  async onLoad(commentId) {
    const { comments, level } = this.state;
    const result = await this.backend().get(`comment/list/${commentId}/level/${level}/`);
    pprint('CommentBox', result);

    const comment = this.findCommentById(comments, commentId);
    if (comment != null) {
      comment.hide_children = false;
      comment.children = result.data.children;
    }

    this.setState({ comments });
  }

  onReply(commentId) {
    this.setState({ dialogOpen: true, currentId: commentId });
  }

  onDialogClose() {
    this.setState({ dialogOpen: false, currentId: null });
  }

  findCommentById(comments, id) {
    let comment;
    for (const elem of comments) {
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

  render() {
    const {
      comments, inputs, dialogOpen, inputsReady, currentId,
    } = this.state;
    const { channelKey, videoKey } = this.props;

    let rootCommentForm = <div />;
    let childCommentForm = <div />;
    if (inputsReady) {
      rootCommentForm = (
        <ServerForm
          action={`channel/${channelKey}/video/${videoKey}/comment/add/`}
          enctype="application/json"
          name="root-comment"
          inputs={inputs}
          inputsHidden={[{ name: 'parent_id', value: null }]}
        />
      );
      childCommentForm = (
        <ServerForm
          action={`channel/${channelKey}/video/${videoKey}/comment/add/`}
          enctype="application/json"
          name="child-comment"
          inputs={inputs}
          inputsHidden={[{ name: 'parent_id', value: currentId }]}
          onSubmitSuccess={() => this.onDialogClose()}
        />
      );
    }

    return (
      <div>
        <div className={classes.commentRoot}>
          {rootCommentForm}
        </div>
        <Divider />
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

        <Dialog open={dialogOpen} onClose={() => this.onDialogClose()} title="Ответ на комментарий">
          {childCommentForm}
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
