import React, { Component } from 'react';
import {
  DialogContent, ExpansionPanel, ExpansionPanelSummary, CardContent, Typography, Card,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Comment } from '../../../components/VideoWatch/Comment/Comment';
import InteractivePlayer from '../../../components/VideoWatch/InteractivePlayer/InteractivePlayer';
import ExpansionPanelVideo from '../../../components/VideoWatch/ExpansionPanel';
import Input from '../../../components/Input/Input';
import Dialog from '../../../components/Dialog';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import classes from './WatchVideo.module.css';
import { perror } from '../../../helpers/SmartPrint';

const statuses = {
  LOADED: 1,
  NOT_LOADED: 2,
  ERROR: 3,
};

class WatchVideo extends Component {
  constructor(props) {
    super(props);
    const { videoKey, channelKey } = props.match.params;
    this.state = {
      status: statuses.NOT_LOADED,
      video: null,
      author: 'admin',
      videoKey,
      dialogOpen: false,
      channelKey,
      inputs: [],
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const { videoKey, channelKey } = this.state;

      const response = await this.backend().get(`video/get/${videoKey}/`);
      this.setState({ video: response.data });

      const result = await this.backend().get(`channel/${channelKey}/video/${videoKey}/comment/add/`);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      this.setState({ status: statuses.ERROR });
      perror('WatchVideo', error);
    }
  }

  async submitHandler() {
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
        this.setState({ isSent: true });
      } catch (error) {
        perror('WatchVideo', error);
      }
    } else {
      console.log('Invalid input');
    }
  }

  getData() {
    const { inputs, parentId } = this.state;
    const result = {};
    inputs.map((input) => {
      result[input.name] = input.value;
      result.parent_id = parentId;
      return 0;
    });
    return result;
  }

  callbackDialog(state) {
    this.setState({ dialogOpen: state });
    this.submitHandler();
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }


  callbackComment(state) {
    this.setState({ dialogOpen: true, parentId: state.commentId });
  }

  render() {
    const {
      video, viewsCounter, ratingCounter, yourChoice,
      isLoaded, dialogOpen, channelKey, videoKey, inputs, author,
    } = this.state;
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
          callback={state => this.callbackInput(state)}
        />
      );
    });
    let result = null;
    if (isLoaded) {
      result = (
        <div className={classes.textStyles}>

          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Название:
                {' '}
                {video.name}
              </Typography>
            </CardContent>
          </Card>

          <InteractivePlayer main={video.head_video_part} codec={video.codec} />

          <ExpansionPanelVideo
            created={video.created}
            author={author}
            description={video.description}
            keyVideo={videoKey}
            keyChannel={channelKey}
            views={viewsCounter}
            rating={ratingCounter}
            choice={yourChoice}
            inputs={inputs}
          />

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Ко всем комментариям:</Typography>
            </ExpansionPanelSummary>
            { video.head_comments.map(commentId => <Comment commentId={commentId} callback={state => this.callbackComment(state)} key={commentId} />)}
          </ExpansionPanel>

          <Dialog dialogOpen={dialogOpen} callback={state => this.callbackDialog(state)} title="Ответ на комментарий">
            <DialogContent>
              {Inputs}
            </DialogContent>
          </Dialog>
        </div>
      );
    } else {
      result = <div>Загрузка</div>;
    }

    return result;
  }
}

export default WatchVideo;
