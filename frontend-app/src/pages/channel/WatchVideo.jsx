import React, { Component } from 'react';
import axios from 'axios';
import { InteractivePlayer } from '../../components/InteractivePlayer';

const textStyles = {
  position: 'relative',
  overflow: 'hidden',
  paddingLeft: '5%',
  paddingRight: '5%',
};

export class WatchVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: statuses.NOT_LOADED,
      video: null,
    };
  }

  componentDidMount() {
    const { key } = this.props.match.params;
    const url = `http://100.100.150.128:8000/video/get/${key}`;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    axios.get(url, config).then(
      (result) => {
        console.log(result.data);

        this.setState({ status: statuses.LOADED, video: result.data });
      },
    ).catch((error) => {
      console.log(error);
      this.setState({ status: statuses.ERROR });
    });
  }


  render() {
    const { status, video } = this.state;

    let result = null;
    if (status === statuses.LOADED) {
      result = (
        <div style={textStyles}>
          Название: { video.name } <br />
          Создано : { video.created } <br />
          Описание: { video.description } <br />
          <InteractivePlayer main={video.head_video_part} codec={video.codec} />
        </div>
      );
    } else if (status === statuses.NOT_LOADED) {
      result = <div>Not loaded</div>;
    } else {
      result = <div>Error</div>;
    }

    return result;
  }
}

const statuses = {
  LOADED: 1,
  NOT_LOADED: 2,
  ERROR: 3,
};
