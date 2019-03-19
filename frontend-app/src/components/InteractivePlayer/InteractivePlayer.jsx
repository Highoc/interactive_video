import React, { Component } from 'react';
import axios from 'axios';
import 'video-react/dist/video-react.css';
import PropTypes from 'prop-types';
import path from '../../Backend';

import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  VolumeMenuButton,
  CurrentTimeDisplay,
  TimeDivider,
  BigPlayButton,
} from 'video-react';

const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string,
};

const videoStyles = {
  position: 'relative',
  maxhight: '560',
  overflow: 'hidden',
};
const buttonStyles = {
  position: 'absolute',
  bottom: '25%',
  left: '40%',
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
  },
  input: {
    display: 'none',
  },

});

export class InteractivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      videoQueue: new AppendQueue(),
      timeResolver: new TimeResolver(),
      currentTime: 0,
      questions: [],
      timeFrame: {
        begin: 0,
        end: 0,
      },
    };

    this.handleEvents();
  }

  componentDidMount() {
    this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));

    const { codec, main } = this.props;
    const mimeCodec = `video/mp4; codecs="${codec}"`;

    const { videoQueue, timeResolver } = this.state;
    this.setState({ url: videoQueue.addMediaSource(mimeCodec) });

    const url = `http://${path}/video/part/get/${main}/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    videoQueue.pushKey(main);
    timeResolver.pushTimeKey(main);

    axios.get(url, config).then(
      (response) => {
        console.log(response.data);

        axios.get(response.data.content_url, {
          responseType: 'arraybuffer',
        }).then(
          (responseSource) => {
            videoQueue.pushSource(main, responseSource.data, response.data.time);
            timeResolver.pushTimeSource(main, response.data.time);

            this.setState({
              children: [response.data],
              timeFrame: timeResolver.getTimeFrame(main),
            });

            this.videoByChoice(main);
          },
        ).catch(error => console.log(error));
      },
    ).catch(error => console.log(error));
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { currentTime, timeFrame } = nextState;
    const d = timeFrame.end - currentTime;
    if (d < 0) {
      this.videoByChoice(nextState.nextKey);
    }
  }

  handleEvents() {
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.seek = this.seek.bind(this);
  }

  videoByChoice(answerKey) {
    const { videoQueue, timeResolver, children } = this.state;

    const currentVideo = children.find(child => child.key === answerKey);
    const timeFrame = timeResolver.getTimeFrame(answerKey);

    this.setState({
      currentVideo,
      timeFrame,
      questions: [],
      children: [],
      nextKey: currentVideo.children[0],
    });

    this.seek(timeFrame.begin);

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    for (const childKey of currentVideo.children) {
      videoQueue.pushKey(childKey);
      timeResolver.pushTimeKey(childKey);

      const url = `http://${path}/video/part/get/${childKey}/`;
      axios.get(url, config).then(
        (response) => {
          console.log(response.data);

          const { questions } = this.state;
          const { key, text } = response.data;
          this.setState({
            questions: [...questions, { key, text }],
          });

          axios.get(response.data.content_url, {
            responseType: 'arraybuffer',
          }).then(
            (responseSource) => {
              videoQueue.pushSource(childKey, responseSource.data, response.data.time);
              timeResolver.pushTimeSource(childKey, response.data.time);

              this.setState({
                children: [...this.state.children, response.data],
              });
            },
          ).catch(error => console.log(error));
        },
      ).catch(error => console.log(error));
    }
  }

  handleStateChange(state, prevState) {
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
    console.log(key);
    this.setState({ nextKey: key });
  }

  render() {
    const {
      url, currentTime, timeFrame, questions,
    } = this.state;

    let buttons = <div />;
    const d = timeFrame.end - currentTime;
    if (d > 0 && d < 5) {
      buttons = (
        <div>
          {questions.map(elem => (
            <button type="submit" key={elem.key} onClick={() => this.handleAnswer(elem.key)}>
              {elem.text}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div style={videoStyles}>
        {buttons}
        <Player ref="player" src={url} fluid={true}>
          <BigPlayButton position="center" />
          <ControlBar autoHide>
            <ReplayControl seconds={10} order={1.1} />
            <ForwardControl seconds={10} order={1.2} />
            <CurrentTimeDisplay order={4.1} />
            <TimeDivider order={4.2} />
            <VolumeMenuButton order={7} vertical />
          </ControlBar>
        </Player>
      </div>
    );
  }
}

class AppendQueue {
  constructor() {
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
  }

  pushSource(key, buf, time) {
    const videoPart = this.queue.find(elem => elem.key === key);
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
