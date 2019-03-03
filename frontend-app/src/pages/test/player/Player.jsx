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
  CurrentTimeDisplay,
  TimeDivider,
  VolumeMenuButton
} from 'video-react';
import axios from "axios";


const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string
};

const sources = {
  sintelTrailer: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
  bunnyTrailer: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
  bunnyMovie: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  test: 'http://media.w3.org/2010/05/video/movie_300.webm',
};


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
      source: sources['bunnyMovie'],
      keys: [],
    };

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.load = this.load.bind(this);
    this.changeCurrentTime = this.changeCurrentTime.bind(this);
    this.seek = this.seek.bind(this);
  }

  componentDidMount() {
    // subscribe state change
    this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }

  handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.setState({
      player: state
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
        source: sources[name]
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
        console.log(result.data);
        this.setState({keys: result.data});
        
      })
      .catch((error) => {
        console.log(error);
      });

    event.preventDefault();
  }
  onButton2Click(event) {
    axios.get(
      'http://192.168.1.205:8000/video/source_get/2a7f6188b3c448dfa783c7ecc480a758/',
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      },
    )
      .then((result) => {
        console.log(result.data);
        this.setState({ source: result.data });
      })
      .catch((error) => {
        console.log(error);
      });

    event.preventDefault();
  }




  render() {
    const { classes } = this.props;
    return (
      <div>
        <div style={videoStyles}>
          <Player ref="player" autoPlay >
            <source src={this.state.source} />
            <ControlBar>
              <ReplayControl seconds={10} order={1.1} />
              <ForwardControl seconds={30} order={1.2} />
              <CurrentTimeDisplay order={4.1} />
              <TimeDivider order={4.2} />
              <VolumeMenuButton />
            </ControlBar>
          </Player>
        </div>
        <div style={buttonStyles}>
          <Button onClick={this.changeSource('bunnyMovie')} size={"medium"} variant="contained">
            bunnyMovie
          </Button>
          <Button onClick={this.changeSource('bunnyTrailer')} size={"medium"} variant="contained">
            Bunny trailer
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
