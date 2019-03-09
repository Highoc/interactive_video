import React, { Component } from 'react';
import axios from 'axios';

export class InteractivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: true,
      children: [],
      video: null,
      videoQueue: new AppendQueue(),
    };
  }

  componentDidMount() {
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    const { videoQueue } = this.state;
    const mediaSourceUrl = videoQueue.addMediaSource(mimeCodec);
    this.setState({ url: mediaSourceUrl });

    const { main } = this.props;
    const url = `http://192.168.1.205:8000/video/part/get/${main}`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    videoQueue.pushKey(main);

    axios.get(url, config).then(
      (response) => {
        console.log(response);
        // response.data.content_url
        axios.get('https://hb.bizmrg.com/interactive_video/frag_bunny.mp4', {
          responseType: 'arraybuffer',
        }).then(
          (responseSource) => {
            videoQueue.pushSource(main, responseSource.data, response.data.time);
            this.setState({
              children: [response.data],
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

  videoByChoice(key) {
    const current_video = this.state.children.find(child => child.key === key);
    this.setState({ current_video });
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    this.setState({ children: [] });

    const { videoQueue } = this.state;

    for (const now_key of current_video.children) {
      // добавить ключ в очередь append
      videoQueue.pushKey(now_key);
      const url = `http://192.168.1.205:8000/video/part/get/${now_key}`;
      axios.get(url, config).then(
        (response) => {
          console.log(response);
          // response.data.content_url
          axios.get('https://hb.bizmrg.com/interactive_video/frag_bunny.mp4', {
            responseType: 'arraybuffer',
          }).then(
            (responseSource) => {
              videoQueue.pushSource(now_key, responseSource.data, response.data.time);
              const newChildren = [...this.state.children, response.data];
              this.setState({ children: newChildren });
            },
          ).catch(error => console.log(error));
        },
      ).catch(error => console.log(error));
    }
  }

  render() {
    const { isReady, url } = this.state;
    let result = null;
    if (isReady) {
      result = (
        <div>
          <div>Ready</div>
          <video
            id="video"
            src={url}
            height="300px"
            muted
            controls
          >
            Interactive Video Player
          </video>
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
    videoPart.time = AppendQueue.getSeconds(time);
    this.checkQueue();
  }

  checkQueue() {
    if (!this.isReady || this.sourceBuffer.updating || !this.queue.length) {
      return;
    }

    if (this.queue[0].isLoaded) {
      const currentPart = this.queue.shift();
      console.log(currentPart);
      // currentPart.time
      this.sourceBuffer.timestampOffset += 60;
      this.sourceBuffer.appendBuffer(currentPart.buf);
    }
  }

  static getSeconds(time) {
    const splitted = time.split(':');
    return parseFloat(splitted[0]) * 3600 + parseFloat(splitted[1]) * 60 + parseFloat(splitted[2]);
  }
}
