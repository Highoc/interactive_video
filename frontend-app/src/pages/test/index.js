import React, { Component } from 'react';

import Video from './video';

import defaults from './defaults';


export default class VideoEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 0,
    };

    this.onRangeChange = this.onRangeChange.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);

    this.onVideoError = this.onVideoError.bind(this);
    this.onVideoReady = this.onVideoReady.bind(this);
    this.onVideoProgress = this.onVideoProgress.bind(this);
    this.onVideoTimeupdate = this.onVideoTimeupdate.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  safeState(state, cb) {
    if (this._mounted) {
      this.setState(state, cb);
    }
  }

  onVideoError(e) {
    if (
      this._mounted
			&& this.props.onError
    ) {
      this.props.onError(e);
    }
  }

  onVideoReady(filesData, mediaSource) {
    const { duration } = mediaSource;

    this.safeState({
      duration,
      filesData,
      ready: true,
    });

    this.onReady(filesData, mediaSource);

    if (this.props.debug) {
      console.log('* requested files:', this.props.files.length);
      console.log('* displaying files:', filesData.length);
      console.log('* total time:', duration);
    }
  }

  onVideoProgress(progress) {
    this.safeState({ progress });
  }

  onVideoTimeupdate(position) {
    this.safeState({
      position,
      playing: position,
      interactive: true,
    });
  }

  onPositionChange(position) {
    this.safeState({
      position,
      currentTime: position,
      interactive: true,
    });
  }

  onRangeChange(values, position) {
    this.safeState({
      values,
      currentTime: position,
      interactive: false,
    });

    this.onChange(values, position);
  }

  getValues() {
    const { values } = this.props;

    return values && values.length
      ? values : [[0, this.state.duration]];
  }

  onChange(...args) {
    if (this.props.onChange) {
      this.props.onChange(...args);
    }
  }

  onReady(...args) {
    if (this.props.onReady) {
      this.props.onReady(...args);
    }
  }

  render() {
    const {
      ready,
      progress,

      duration,
      filesData,

      playing,
      interactive,

      position,
      currentTime,
    } = this.state;

    const {
      files = [defaults.files],
      videoCodecs = defaults.videoCodecs,
    } = this.props;

    console.log(files);
    console.log(videoCodecs);

    const values = this.getValues();

    return (
      <div className="montage-editor">
        <Video
          files={files}
          values={values}
          interactive={interactive}
          currentTime={currentTime}
          videoCodecs={videoCodecs}
          onVideoError={this.onVideoError}
          onVideoReady={this.onVideoReady}
          onVideoProgress={this.onVideoProgress}
          onVideoTimeupdate={this.onVideoTimeupdate}
        />
      </div>
    );
  }
}
