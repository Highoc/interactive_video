import React, { Component } from 'react';
import axios from 'axios';
import 'video-react/dist/video-react.css';
import PropTypes from 'prop-types';

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
  paddingBottom: '56.25%',
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
      isReady: true,
      children: [],
      videoQueue: new AppendQueue(),
      timeResolver: new TimeResolver(),
      current_time: 0,
      questions: [],
      time_frame: {
        begin: 0,
        end: 0,
      },
    };

    this._handleEvents();
  }

  _handleEvents() {
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.load = this.load.bind(this);
    this.changeCurrentTime = this.changeCurrentTime.bind(this);
    this.seek = this.seek.bind(this);
    //    this.onButton2Click = this.onButton2Click.bind(this);
    //    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));

    const mimeCodec = `video/mp4; codecs="${this.props.codec}"`;
    const { videoQueue, timeResolver } = this.state;
    const mediaSourceUrl = videoQueue.addMediaSource(mimeCodec);
    this.setState({ url: mediaSourceUrl });

    const { main } = this.props;
    const url = `http://192.168.1.205:8000/video/part/get/${main}/`;
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
              time_frame: timeResolver.getTimeFrame(main),
            });

            this.videoByChoice(main);
          },
        ).catch(error => console.log(error));
      },
    ).catch(error => console.log(error));
  }

  /*
* children: [
* { key: ... , url: ..., children: [..., ....] }
* key: { ... }
*
* ]
*
* curr_video = { ... }
* забрать всех детей
* childr: { key: ... }
* аппенд для всех детей
* */

  videoByChoice(keyV) {
    this.setState({ time_frame: this.state.timeResolver.getTimeFrame(keyV) });
    this.seek(this.state.time_frame.begin);

    const current_video = this.state.children.find(child => child.key === keyV);
    this.setState({ current_video, questions: [] });

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    const { videoQueue, timeResolver } = this.state;
    this.setState({ children: [], time_frame: timeResolver.getTimeFrame(keyV) });


    for (const now_key of current_video.children) {
      // добавить ключ в очередь append
      videoQueue.pushKey(now_key);
      timeResolver.pushTimeKey(now_key);

      const url = `http://192.168.1.205:8000/video/part/get/${now_key}/`;
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
              videoQueue.pushSource(now_key, responseSource.data, response.data.time);
              timeResolver.pushTimeSource(now_key, response.data.time);

              const newChildren = [...this.state.children, response.data];
              this.setState({
                children: newChildren,
              });
            },
          ).catch(error => console.log(error));
        },
      ).catch(error => console.log(error));
    }
  }

  handleStateChange(state, prevState) {
    this.setState({
      current_time: state.currentTime,
    });
  }

  play() {
    this.refs.player.play();
  }

  pause() {
    this.refs.player.pause();
  }

  load() {
    this.refs.player.load();
  }

  changeCurrentTime(seconds) {
    return () => {
      const { player } = this.refs.player.getState();
      const currentTime = player.currentTime;
      player.seek(currentTime + seconds);
    };
  }

  seek(seconds) {
    return () => {
      this.refs.player.seek(seconds);
    };
  }

  handleAnswer(key) {
    console.log(key);
    this.setState({ next_key: key });
  }

  componentWillUpdate(nextProps, nextState) {
    const { current_time, time_frame } = nextState;
    const d = time_frame.end - current_time;
    if (d < 0) {
      this.videoByChoice(nextState.next_key);
    }
  }
 
  render() {
    const {
      isReady, url, current_time, time_frame, questions,
    } = this.state;

    let buttons = <div>Пока нет кнопок</div>;
    const d = time_frame.end - current_time;
    if (d > 0 && d < 5) {
      //  state.questions = [ { key: ..., question: ... } ]
      buttons = (
        <div>
          {questions.map(elem => (
            <button key={elem.key} onClick={() => this.handleAnswer(elem.key)}>
              {elem.text}
            </button>
          ))}
        </div>
      );
    }

    let result = null;
    if (isReady) {
      result = (
        <div>
          <div style={videoStyles}>
            {buttons}
            <Player ref="player" src={url} fluid={false}>
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
        </div>
      );
    } else {
      result = <div>Not ready</div>;
    }
    return result;
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
