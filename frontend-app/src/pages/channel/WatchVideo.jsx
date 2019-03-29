import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Comment } from '../../components/Comment/Comment';
import InteractivePlayer from '../../components/InteractivePlayer/InteractivePlayer';
import ExpansionPanelVideo from '../../components/ExpansionPanel';
import Input from '../../components/Input/Input';
import { backend as path } from '../../urls';


import {
  subscribeToChannel as subscribe,
  unsubscribeFromChannel as unsubscribe,
} from '../../actions/centrifugo';


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
    const { videoKey, channelKey } = props.match.params;
    this.state = {
      status: statuses.NOT_LOADED,
      video: null,
      author: 'admin',
      videoKey,
      viewsCounter: 0,
      dialogOpen: false,
      channelKey,
      inputs: [],
      isLoaded: false,
    };
  }

  async componentDidMount() {
    try {
      const { videoKey, channelKey } = this.state;

      const config = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      };

      let url = `http://${path}/video/get/${videoKey}/`;
      let response = await axios.get(url, config);
      this.setState({ video: response.data });

      url = `http://${path}/views/add/${videoKey}/`;
      response = await axios.post(url, {}, config);
      this.setState({ viewsCounter: response.data.counter });

      url = `http://${path}/rating/get/${videoKey}/`;
      response = await axios.get(url, config);
      this.setState({ ratingCounter: response.data.counter, yourChoice: response.data.value });

      this.setState({ status: statuses.LOADED });

      const { subscribeToChannel } = this.props;
      subscribeToChannel(`video/${videoKey}/comments`, data => console.log(data));
      subscribeToChannel(`video/${videoKey}/rating`, data => this.updateRatingCounter(data));
      subscribeToChannel(`video/${videoKey}/views`, data => this.updateViewsCounter(data));

      const urlInput = `http://${path}/channel/${channelKey}/video/${videoKey}/comment/add/`;
      const configInput = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
        },
      };
      const result = await axios.get(urlInput, configInput);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      this.setState({ status: statuses.ERROR });
      console.log(`[WatchVideo] ${error} ${JSON.stringify(error.response.data)}`);
    }
  }

  componentWillUnmount() {
    const { unsubscribeFromChannel } = this.props;
    const { videoKey } = this.state;
    unsubscribeFromChannel(`video/${videoKey}/comments`);
    unsubscribeFromChannel(`video/${videoKey}/rating`);
    unsubscribeFromChannel(`video/${videoKey}/views`);
  }

  updateViewsCounter(views) {
    this.setState({ viewsCounter: views.counter });
    console.log(`[WatchVideo] Centrifugo > ${JSON.stringify(views)}`);
  }

  updateRatingCounter(rating) {
    this.setState({ ratingCounter: rating.counter });
    console.log(`[WatchVideo] Centrifugo > ${JSON.stringify(rating)}`);
  }

  handleRatingChoice(choice) {
    const { ratingCounter } = this.state;
    this.setState({ ratingCounter: ratingCounter + choice });
  }

  async submitHandler() {
    const { inputs, channelKey, videoKey } = this.state;
    let isValid = true;
    console.log(inputs);
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      this.setState({ dialogOpen: false });
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

        this.setState({ isSent: true });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Invalid input');
    }
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
    const {
      status, video, viewsCounter, ratingCounter, yourChoice,
      isLoaded, dialogOpen, channelKey, videoKey, inputs, author,
    } = this.state;
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
            description={video.description}
            keyVideo={videoKey}
            keyChannel={channelKey}
            views={viewsCounter}
            rating={ratingCounter}
            choice={yourChoice}
            inputs={inputs}
            callback={choice => this.handleRatingChoice(choice)}
          />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Ко всем комментариям:</Typography>
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
    } else {
      result = <div>Загрузка</div>;
    }

    return result;
  }
}

WatchVideo.propTypes = {
  classes: PropTypes.object.isRequired,
  subscribeToChannel: PropTypes.func.isRequired,
  unsubscribeFromChannel: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isReady: state.centrifugo.isInitialised,
});

const mapDispatchToProps = dispatch => ({
  subscribeToChannel: (channel, callback) => dispatch(subscribe(channel, callback)),
  unsubscribeFromChannel: channel => dispatch(unsubscribe(channel)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WatchVideo));
