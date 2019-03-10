import React, { Component } from 'react';
import axios from 'axios';

export class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      url: '',
    };

    this._handleEvents();
  }

  componentDidMount() {
    this.setState({ video: document.getElementById('video') });

    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
      const mediaSource = new MediaSource();
      const url = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', this.sourceOpen);
      this.setState({ url });
    } else {
      console.error('Unsupported MIME type or codec: ', mimeCodec);
    }
  }

  _handleEvents() {
    this.handlePlay = this.handlePlay.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleNext1 = this.handleNext1.bind(this);
    this.handleNext2 = this.handleNext2.bind(this);
    this.handleNextTime = this.handleNextTime.bind(this);
    this.handlePrevTime = this.handlePrevTime.bind(this);
  }

  handlePlay(event) {
    const { video } = this.state;
    video.play();
  }

  handleStop(event) {
    const { video } = this.state;
    video.pause();
  }

  handleNext2(event) {
    const { video } = this.state;
    video.currentTime = 60;
  }

  handleNext1(event) {
    const { video } = this.state;
    video.currentTime = 0;
  }

  handleNextTime(event) {
    const { video } = this.state;
    video.currentTime += 5;
  }

  handlePrevTime(event) {
    const { video } = this.state;
    video.currentTime -= 5;
  }

  sourceOpen(_) {
    const mediaSource = this;
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    const assetURL = 'http://localhost:8000/video/test/';
    let i = 2;

    fetchData(assetURL, (buf) => {
      sourceBuffer.addEventListener('updateend', () => {
        console.log(i);
        sourceBuffer.timestampOffset += 70.008;
        i -= 1;
        if (i === 0) {
          console.log('exit');
          return;
        }
        sourceBuffer.appendBuffer(buf);
      });

      sourceBuffer.appendBuffer(buf);
    });
  }

  render() {
    const { url } = this.state;

    return (
      <div>
        <video
          id="video"
          src={url}
          height="300px"
          muted
          controls
        >

        </video>
        <br />
        <button onClick={this.handlePlay}>Play</button>
        <button onClick={this.handleStop}>Stop</button>
        <button onClick={this.handleNext1}>1</button>
        <button onClick={this.handleNext2}>2</button>
        <button onClick={this.handleNextTime}>+5 sec</button>
        <button onClick={this.handlePrevTime}>-5 sec</button>
      </div>
    );
  }
}

function fetchData(url, cb) {
  const testURL = 'https://hb.bizmrg.com/interactive_video/public_test/part3_dashinit.mp4';
  const myInit = {
    method: 'GET',
    mode: 'cors',
  };

  const myRequest = new Request(testURL, myInit);

  fetch(myRequest).then((response) => {
    return response.arrayBuffer();
  }).then((array) => {
    console.log(array);
    cb(array);
  }).catch((e) => {
    console.log(e);
  });
}