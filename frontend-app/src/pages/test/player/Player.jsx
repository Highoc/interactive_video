import React, { Component } from 'react';
import 'video-react/dist/video-react.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/index';


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
import axios from 'axios';


const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string,
};

const sources = {
  test: 'https://github.com/nickdesaulniers/netfix/blob/gh-pages/demo/frag_bunny.mp4',
  test2: 'https://github.com/nickdesaulniers/netfix/blob/gh-pages/demo/frag_bunny.mp4',
  bunnyMovie: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  aa: 'http://media.w3.org/2010/05/video/movie_300.webm',
};

const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';


const videoStyles = {
  position: 'relative',
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


class WatchVideo extends Component {
  constructor(props, context) {
    super(props, context);


    this.state = {
      source: sources.test,
      keys: null,
      mediaSource: null,
    };


    this.createSource = this.createSource.bind(this);
    this.sourceOpen = this.sourceOpen.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.load = this.load.bind(this);
    this.changeCurrentTime = this.changeCurrentTime.bind(this);
    this.onButton2Click = this.onButton2Click.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.seek = this.seek.bind(this);

  }

  componentDidMount() {
    // subscribe state change
    this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }

  handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.setState({
      player: state,
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
      this.refs.player.seek(currentTime + seconds);
    };
  }

  seek(seconds) {
    return () => {
      this.refs.player.seek(seconds);
    };
  }


  changeSource(name) {
    return () => {
      this.setState({
        source: sources[name],
      });
      this.refs.player.load();
    };
  }

  onButtonClick(event) {
    axios.get(
      'http://192.168.1.205:8000/video/source_info/',
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      },
    )
      .then((result) => {
        const list = result.data.sources;
        const keysList = [];
        list.forEach((item, index, array) => {
          keysList.push(Object.keys(item));
        });
        this.setState({ keys: keysList });
        console.log('ok');
      })
      .catch((error) => {
        console.log(error);
      });

    event.preventDefault();
  }

  fetchAB(url, cb) {
    console.log(url);
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      cb(xhr.response);
    };
    xhr.send();
  }


  onButton2Click(event) {
    const key = this.state.keys[0].toString();
    const key2 = this.state.keys[1].toString();
    console.log(key);
    axios.get(
      `http://192.168.1.205:8000/video/source_get/${key}/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      },
    )
      .then((result) => {
        console.log(result.data);
        sources.test = result.data.content_url;
        this.setState({ source: result.data });
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get(
      `http://192.168.1.205:8000/video/source_get/${key2}/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      },
    )
      .then((result) => {
        console.log(result.data);
        console.log(result.data.content_url);
        sources.test2 = result.data.content_url;
        this.setState({ source: result.data });
      })
      .catch((error) => {
        console.log(error);
      });

    event.preventDefault();
  }

  sourceOpen() {
    console.log(this.state.mediaSource); // open
  }

  createSource() {
    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
      this.state.mediaSource = new MediaSource();
      Player.src = URL.createObjectURL(this.state.mediaSource);
      console.log(this.state.mediaSource.readyState); // closed
      this.state.mediaSource.addEventListener('sourceopen', this.sourceOpen);
    } else {
      console.error('Unsupported MIME type or codec: ', mimeCodec);
    }
  }

  render() {
    const { classes } = this.props;
    this.createSource();
    return (
      <div>
        <div style={videoStyles}>
          <Player ref="player">
            <ControlBar>
              <BigPlayButton position="center" />
              <ReplayControl seconds={10} order={1.1} />
              <ForwardControl seconds={30} order={1.2} />
              <CurrentTimeDisplay order={4.1} />
              <TimeDivider order={4.2} />
              <VolumeMenuButton />
            </ControlBar>
          </Player>
        </div>
        <div style={buttonStyles}>
          <Button onClick={this.changeSource('test2')} size="medium" variant="contained">
              test2
          </Button>
          <Button onClick={this.changeSource('test')} size="medium" variant="contained">
              test
          </Button>
          <Button onClick={this.sourceOpen()} size="medium" variant="contained">
              sourceopen
          </Button>
        </div>
        <button onClick={this.onButtonClick}>List Info</button>
        <button onClick={this.onButton2Click}>Get LINK</button>
      </div>
    );
  }
}

WatchVideo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WatchVideo);
