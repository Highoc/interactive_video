import React, { Component } from 'react';
import 'video-react/dist/video-react.css';
import { ButtonBase, Typography } from '@material-ui/core';
import {
  Player,
  ReplayControl,
  ForwardControl,
  VolumeMenuButton,
  BigPlayButton,
  ControlBar,
  PlayToggle,
  FullscreenToggle,
} from 'video-react';
import { perror, pprint } from '../../../helpers/SmartPrint';
import classes from './InteractivePlayer.module.css';
import { RequestResolver } from '../../../helpers/RequestResolver';

const styles = {
  transition: 'all 1s ease-out',
};


class InteractivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      videoQueue: new AppendQueue(),
      timeResolver: new TimeResolver(),
      isVideoFinished: false,
      currentTime: 0,
      questions: [],
      timeFrame: {
        begin: 0,
        end: 0,
      },
    };
    this.backend = RequestResolver.getGuest();
    this.aws = RequestResolver.getAWS();
    this.handleEvents();
  }

  async componentDidMount() {
    this.loadData();
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { currentTime, timeFrame } = nextState;
    const d = timeFrame.end - currentTime;
    if (d < 0) {
      this.videoByChoice(nextState.nextKey);
    }
  }

  async loadData() {
    const { videoQueue, timeResolver } = this.state;
    videoQueue.reload();
    timeResolver.reload();
    this.setState({
      questions: [],
      children: [],
    });
    try {
      this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
      const { codec, main } = this.props;
      const mimeCodec = `video/mp4; codecs="${codec}"`;

      this.setState({ url: videoQueue.addMediaSource(mimeCodec) });

      videoQueue.pushKey(main);
      timeResolver.pushTimeKey(main);

      const responseMain = await this.backend().get(`video/part/get/${main}/`);

      const responseSource = await this.aws().get(responseMain.data.content_url);
      videoQueue.pushSource(main, responseSource.data, responseMain.data.time);
      timeResolver.pushTimeSource(main, responseMain.data.time);

      pprint('InteractivePlayer', responseMain.data);
      pprint('InteractivePlayer', responseSource.data);

      this.setState({
        children: [responseMain.data],
        timeFrame: timeResolver.getTimeFrame(main),
      });
      this.videoByChoice(main);
    } catch (error) {
      perror('InteractivePlayer', error);
    }
  }

  handleEvents() {
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.seek = this.seek.bind(this);
  }

  async videoByChoice(answerKey) {
    const { videoQueue, timeResolver, children } = this.state;

    const currentVideo = children.find(child => child.key === answerKey);
    const timeFrame = timeResolver.getTimeFrame(answerKey);
    if (!currentVideo) {
      return;
    }
    this.setState({
      currentVideo,
      timeFrame,
      questions: [],
      children: [],
      nextKey: currentVideo.children[0],
    });

    this.seek(timeFrame.begin);

    if (currentVideo.children.length === 0) {
      console.log('Currentvideo');
      this.setState({ videoTimeEnd: timeFrame.end, isVideoFinished: true });
      videoQueue.pushKey(null);
      return;
    }

    for (const childKey of currentVideo.children) {
      videoQueue.pushKey(childKey);
      timeResolver.pushTimeKey(childKey);
      try {
        const response = await this.backend().get(`video/part/get/${childKey}/`);

        const { questions, children } = this.state;
        const { key, text } = response.data;
        this.setState({
          questions: [...questions, { key, text }],
        });

        const responseSource = await this.aws().get(response.data.content_url);
        videoQueue.pushSource(childKey, responseSource.data, response.data.time);
        timeResolver.pushTimeSource(childKey, response.data.time);

        this.setState({
          children: [...children, response.data],
        });

      } catch (error) {
        perror('InteractivePlayer', error);
      }
    }
  }

  handleStateChange(state, prevState) {
    const { isVideoFinished, videoTimeEnd } = this.state;
    if (isVideoFinished && state.currentTime >= videoTimeEnd) {
      this.loadData().then(() => {
        console.log('loadData;');
        this.setState({ isVideoFinished: false });
      });
    }
    this.setState({
      currentTime: state.currentTime,
    });
  }

  play() {
    this.refs.player.play();
  }

  pause() {
    this.refs.player.pause();
  }

  seek(seconds) {
    this.refs.player.seek(seconds);
  }

  handleAnswer(key) {
    this.setState({ nextKey: key });
  }

  render() {
    const {
      url, currentTime, timeFrame, questions, nextKey,
    } = this.state;

    let buttons = <div />;
    const d = timeFrame.end - currentTime;
    if (d > 0 && d < 5 && questions.length === 2) {
      buttons = (
        <div className={classes.buttonStyles}>
          <div className={classes.animationTime} style={{...styles, transform: 'translate3d(-' + d * 20 + '%,0,0)' }} />
          {questions.map(elem => (
            <ButtonBase
              focusRipple
              key={elem.key}
              onClick={() => this.handleAnswer(elem.key)}
              className={classes.oneBlock}
            >
              <Typography
                variant="h1"
                className={nextKey === elem.key ? classes.chosen : classes.text}
              >
                {elem.text}
              </Typography>
            </ButtonBase>
          ))}
        </div>
      );
    }

    return (
      <div className={classes.videoStyles}>
        <Player ref="player" src={url} fluid={false} width="100%" height="650px">
          {buttons}
          <BigPlayButton position="center" />
          <ControlBar disableDefaultControls className={classes.controlBar}>
            <PlayToggle order={2} className={classes.Button} />
            <ReplayControl seconds={5} order={3} className={classes.Button} />
            <ForwardControl seconds={5} order={4} className={classes.Button} />
            <VolumeMenuButton order={7} vertical className={classes.Button} />
            <FullscreenToggle order={9} className={classes.ButtonFullScreen} />
          </ControlBar>
        </Player>
      </div>
    );
  }
}

export default InteractivePlayer;

class AppendQueue {
  constructor() {
    this.mediaSource = null;
    this.sourceBuffer = null;

    this.isReady = false;

    this.queue = [];

    this.totalDuration = 0;
  }

  reload() {
    this.mediaSource = null;
    this.sourceBuffer = null;

    this.isReady = false;

    this.queue = [];

    this.totalDuration = 0;
  }

  addMediaSource(mimeCodec) {
    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
      this.mediaSource = new MediaSource();
      this.mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = this.mediaSource.addSourceBuffer(mimeCodec);
        this.addSourceBuffer(sourceBuffer);
      });
    } else {
      console.error('Unsupported MIME type or codec: ', mimeCodec);
    }
    return URL.createObjectURL(this.mediaSource);
  }

  addSourceBuffer(sourceBuffer) {
    this.sourceBuffer = sourceBuffer;
    this.isReady = true;

    this.sourceBuffer.addEventListener('updateend', () => {
      this.sourceBuffer.timestampOffset = this.totalDuration;
      this.mediaSource.duration = this.totalDuration;
      this.checkQueue();
    });
  }

  pushKey(key) {
    this.queue.push({
      key,
      isLoaded: false,
      buf: null,
      time: 0,
    });
    if (key === null) {
      this.checkQueue();
    }
  }

  pushSource(key, buf, time) {
    const videoPart = this.queue.find(elem => elem.key === key);
    if (!videoPart) {
      return;
    }
    videoPart.isLoaded = true;
    videoPart.buf = buf;
    videoPart.time = time;
    this.checkQueue();
  }

  checkQueue() {
    if (!this.isReady || this.sourceBuffer.updating || !this.queue.length) {
      return;
    }

    if (this.queue[0].key === null) {
      this.queue.shift();
      this.end();
      return;
    }

    if (this.queue[0].isLoaded) {
      const currentPart = this.queue.shift();
      this.totalDuration += currentPart.time;
      this.sourceBuffer.appendBuffer(currentPart.buf);
    }
  }

  end() {
    this.isReady = false;
    this.mediaSource.endOfStream();
  }
}


class TimeResolver {
  constructor() {
    this.timestore = [];
    this.totalDuration = 0;
  }

  reload() {
    this.timestore = [];
    this.totalDuration = 0;
  }

  pushTimeKey(key) {
    this.timestore.push({
      key,
      isLoaded: false,
      duration: null,
    });
  }

  pushTimeSource(key, time) {
    const videoPart = this.timestore.find(elem => elem.key === key);
    videoPart.isLoaded = true;
    videoPart.duration = time;
    this.totalDuration += time;
  }

  getTimeFrame(key) {
    let beginTime = 0;
    let duration = 0;
    for (const time of this.timestore) {
      if (!time.isLoaded) {
        console.log('Err');
      }
      if (time.key === key) {
        duration = time.duration;
        break;
      }
      beginTime += time.duration;
    }
    return {
      begin: beginTime,
      end: beginTime + duration,
    };
  }
}
