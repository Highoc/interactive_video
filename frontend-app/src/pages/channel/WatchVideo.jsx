import React, { Component } from 'react';
import axios from 'axios';
import InteractivePlayer from '../../components/InteractivePlayer/InteractivePlayer';
import ExpansionPanelVideo from '../../components/ExpansionPanel';
import { Comment } from '../../components/Comment/Comment';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import path from '../../Backend';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '../../components/Input/Input';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const textStyles = {
  position: 'relative',
  overflow: 'hidden',
  paddingLeft: '5%',
  paddingRight: '5%',
};

const styles = theme => ({
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  card: {
    width: '100%',
  },
  media: {
    height: 150,
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const statuses = {
  LOADED: 1,
  NOT_LOADED: 2,
  ERROR: 3,
};

class WatchVideo extends Component {
  constructor(props) {
    super(props);
    const { channelKey, videoKey } = props.match.params;
    this.state = {
      status: statuses.NOT_LOADED,
      video: null,
      author: 'admin',
      views: 400,
      rating: 200,
      dialogOpen: false,
      channelKey: channelKey,
      videoKey: videoKey,
      inputs: [],
      isLoaded: false,
    };
  }

  async componentDidMount() {
    const { videoKey, channelKey } = this.state;
    const url = `http://${path}/video/get/${videoKey}/`;

    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    try {
      const result = await axios.get(url, config);
      console.log(result.data);
      this.setState({ status: statuses.LOADED, video: result.data, isLoaded: true  });
    } catch (error) {
      console.log(error);
      this.setState({ status: statuses.ERROR });
    }
    /*
    const urlInput = `http://${path}/channel/${channelKey}/video/${videoKey}/comment/add/`;
    const configInput = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    try {
      const result = await axios.get(urlInput, configInput);
      console.log(result.data);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      console.log(error);
    }*/
  }

  getData() {
    const { inputs, parentId } = this.state;
    const result = {};
    inputs.map((input) => {
      result[input.name] = input.value;
      result.parent_id = parentId;
      return 0;
    });
    console.log(result);
    return result;
  }

  async submitHandler() {
    const { inputs, channelKey, videoKey, parentId } = this.state;
    let isValid = true;
    console.log(inputs);
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      console.log('Отправить можно');
      this.setState({ dialogOpen: false });
      /*
      try {
        const url = `http://${path}/channel/${channelKey}/video/${videoKey}/comment/add/`;
        const data = this.getData();
        const configs = {
          headers: {
            Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
            'Content-Type': 'application/json',
          },
        };

        const result = await axios.post(url, data, configs);

        console.log(result);
        this.setState({ isSent: true });
      } catch (error) {
        console.log(error);
      }*/
    } else {
      console.log('Invalid input');
    }
  }

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }


  callbackComment(state) {
    this.setState({ dialogOpen: true, parentId: state.commentId });
  }

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { status, video, channelKey, videoKey, inputs, isLoaded, dialogOpen, author, views, rating } = this.state;
    console.log(video);

    const Inputs = Object.keys(inputs).map((key) => {
      const inputElement = inputs[key];
      return (
        <Input
          key={key}
          type={inputElement.type}
          name={inputElement.name}
          description={inputElement.description}
          value={inputElement.value}
          rules={inputElement.rules}
          callback={state => this.callbackInput(state)}
        />
      );
    });

    const { classes } = this.props;
    let result = null;
    if (status === statuses.LOADED && isLoaded) {
      result = (
        <div style={textStyles}>
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Название:
                {' '}
                {video.name}
              </Typography>
            </CardContent>
          </Card>
          <InteractivePlayer main={video.head_video_part} codec={video.codec} />

          <ExpansionPanelVideo
            created={video.created}
            author={author}
            views={views}
            rating={rating}
            description={video.description}
            keyVideo={videoKey}
            keyChannel={channelKey}
            inputs={inputs}
          />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Комментарии</Typography>
            </ExpansionPanelSummary>
            { video.head_comments.map(commentId => <Comment commentId={commentId} callback={state => this.callbackComment(state)} />)}
          </ExpansionPanel>

          <Dialog
            onClose={this.handleClose}
            open={dialogOpen}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle onClose={this.handleClose}>
              Добавление комментария
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ваш комментарий:
              </DialogContentText>
              {Inputs}
            </DialogContent>
            <DialogActions>
              <Button onClick={(event) => { event.preventDefault(); this.submitHandler(); }} color="primary">
                Добавить комментарий
              </Button>
            </DialogActions>
          </Dialog>
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

WatchVideo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WatchVideo);

