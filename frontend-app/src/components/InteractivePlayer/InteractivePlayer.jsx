import React, { Component } from 'react';
import axios from 'axios';

export class InteractivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: true,
      children: [],
      video: null,
      append_queue: [],
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
      const mediaSource = new MediaSource();
      this.setState({ mediaSource });
      const url = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', this.sourceOpen.bind(this));
      this.setState({
        url,
        video: document.getElementById('video'),
      });
    } else {
      console.error('Unsupported MIME type or codec: ', mimeCodec);
    }

    const { main } = this.props;
    const url = `http://192.168.1.205:8000/video/part/get/${main}`;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    // добавить ключ в очередь append
    this.state.append_queue.push(main);

    axios.get(url, config).then(
      (response) => {
        console.log(response.data);
        axios.get(response.data.content_url, {
          responseType: 'arraybuffer',
        }).then(
          (response2) => {
            if (this._isMounted) {
              response.data.buf = response2.data;
              this.setState({
                children: [response.data],
              });
              this.videoByChoice(main);
            }
          },
        ).catch(
          (error) => {
            console.log(error);
          },
        );
      },
    ).catch(
      (error) => {
        console.log(error);
      },
    );
    //tut
  }

  sourceOpen(_) {
    const { mediaSource } = this.state;

    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    console.log('-');
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    console.log('+');
    this.setState({ sourceBuffer: sourceBuffer });
    console.log('1');
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
    this._isMounted = true;
    const current_video = this.state.children.find(child => child.key === key);
    this.setState({ current_video });
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    this.setState({ children: [] });

    for (const now_Key of current_video.children) {
      // добавить ключ в очередь append
      this.state.append_queue.push(now_Key);
      const url = `http://192.168.1.205:8000/video/part/get/${now_Key}`;
      axios.get(url, config).then(
        (response) => {
          console.log(response.data);

          axios.get(response.data.content_url, {
            responseType: 'arraybuffer',
          }).then(
            (response2) => {
              if (this._isMounted) {
                response.data.buf = response2.data;
                const newChildren = [...this.state.children, response.data];
                this.setState({children: newChildren});
              }
            },
          ).catch(
            (error) => {
              console.log(error);
            },
          );
        },
      ).catch(
        (error) => {
          console.log(error);
        },
      );
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { append_queue, children, current_video, sourceBuffer, mediaSource, video } = prevState;
    if (append_queue.length > 0 && sourceBuffer !== undefined) {

      const now_key = append_queue[0];
      if (current_video === undefined) return;
      const child = children.find(child => child.key === now_key);

      if (!sourceBuffer.updating) {
        if (current_video.key === now_key) {
          console.log(now_key);
          console.log(mediaSource.readyState);
          sourceBuffer.addEventListener('updateend', () => {
            console.log(mediaSource.readyState);
            sourceBuffer.timestampOffset += 10;
            //this.updateBuffer();
            mediaSource.endOfStream();
            video.play();

          });
          append_queue.shift();
          console.log('2');
          sourceBuffer.appendBuffer(current_video.buf);

        } /*else if (child !== null) {
        sourceBuffer.addEventListener('updateend', () => {
          //sourceBuffer.timestampOffset += 60;
          //this.updateBuffer();
        });
        append_queue.shift();
        //sourceBuffer.appendBuffer(child.buf);
      }*/
      }
    }
  }

  updateBuffer(_) {

  }

  render() {
    const { isReady, url } = this.state;
    let result = null;
    if (isReady) {
      result = (
        <div>
          <div>
            Ready:
            {' '}
            {this.state.currentVideoPart}
            <br />
          </div>
          <video
            id="video"
            src={url}
            height="300px"
            muted
            controls
          >
            XXX
          </video>
        </div>
      );
    } else {
      result = <div>Not ready</div>;
    }
    return result;
  }
}
