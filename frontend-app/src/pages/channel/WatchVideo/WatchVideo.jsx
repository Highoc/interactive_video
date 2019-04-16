import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ExpansionPanel, CardContent, Typography, Card,
} from '@material-ui/core';
import InteractivePlayer from '../../../components/VideoWatch/InteractivePlayer/InteractivePlayer';
import ExpansionPanelVideo from '../../../components/VideoWatch/ExpansionPanel';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import classes from './WatchVideo.module.css';
import { perror } from '../../../helpers/SmartPrint';
import CommentBox from '../../../components/VideoWatch/CommentBox/CommentBox';
import { TagList } from '../../../components/TagList';


class WatchVideo extends Component {
  constructor(props) {
    super(props);
    const { videoKey, channelKey } = props.match.params;
    this.state = {
      video: null,
      videoKey,
      channelKey,
      isLoaded: false,
      openComments: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { videoKey } = this.state;
      const response = await this.backend().get(`video/get/${videoKey}/`);
      this.setState({ video: response.data, isLoaded: true });
    } catch (error) {
      perror('WatchVideo', error);
    }
  }

  render() {
    const {
      video, isLoaded, channelKey, videoKey,
    } = this.state;

    const { username } = this.props;

    let result = null;
    if (isLoaded) {
      result = (
        <div className={classes.textStyles}>

          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h1" align="center">
                {video.name}
              </Typography>
            </CardContent>
          </Card>

          <InteractivePlayer main={video.head_video_part} codec={video.codec} />

          <TagList videoKey={videoKey} tags={video.tags} editable={video.owner === username} classes={classes.tags} />

          <ExpansionPanelVideo
            video={video}
            keyVideo={videoKey}
            keyChannel={channelKey}
          />
          <Typography variant="h1" color="textSecondary">
            Комментарии
          </Typography>
          <ExpansionPanel expanded>
            <CommentBox
              channelKey={channelKey}
              videoKey={videoKey}
              level={3}
              commentsId={video.head_comments}
            />
          </ExpansionPanel>
        </div>
      );
    } else {
      result = <div>Загрузка</div>;
    }

    return result;
  }
}

const mapStateToProps = state => ({
  username: state.authorization.username,
});

export default connect(mapStateToProps)(WatchVideo);
