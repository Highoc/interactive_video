import React, { Component } from 'react';
import {
  ExpansionPanel, CardContent, Typography, Card,
} from '@material-ui/core';
import InteractivePlayer from '../../../components/VideoWatch/InteractivePlayer/InteractivePlayer';
import ExpansionPanelVideo from '../../../components/VideoWatch/ExpansionPanel';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import classes from './WatchVideo.module.css';
import { perror } from '../../../helpers/SmartPrint';
import CommentBox from '../../../components/VideoWatch/CommentBox/CommentBox';

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


  openComments(state) {
    this.setState({ openComments: state.expanded });
  }

  render() {
    const {
      video, isLoaded, channelKey, videoKey, openComments,
    } = this.state;

    let result = null;
    if (isLoaded) {
      result = (
        <div className={classes.textStyles}>

          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h6" align="center">
                {video.name}
              </Typography>
            </CardContent>
          </Card>

          <InteractivePlayer main={video.head_video_part} codec={video.codec} />

          <ExpansionPanelVideo
            video={video}
            keyVideo={videoKey}
            keyChannel={channelKey}
            openComments={state => (this.openComments(state))}
          />

          <ExpansionPanel expanded={openComments}>
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

export default WatchVideo;
