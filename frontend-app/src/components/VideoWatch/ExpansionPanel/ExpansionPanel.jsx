import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import {
  ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Button, Divider,
} from '@material-ui/core';
import Input from '../../Input/Input';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';
import styles from './ExpansionPanel.styles';
import RatingViews from './RatingViews';

class ExpansionPanelVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
      inputs: props.inputs,
      isSent: false,
      channelKey: props.keyChannel,
      videoKey: props.keyVideo,
      expanded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  getData() {
    const { inputs } = this.state;
    const result = {};
    inputs.map((input) => { result[input.name] = input.value; return 0; });
    return result;
  }

  async submitHandler() {
    const { inputs, channelKey, videoKey } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }
    if (isValid) {
      try {
        const data = this.getData();
        await this.backend(json).post(`channel/${channelKey}/video/${videoKey}/comment/add/`, data);
        this.setState({ isSent: true });
      } catch (error) {
        perror('ExpansionPanel', error);
      }
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

  handleChange(expanded) {
    if (expanded) {
      this.setState({
        expanded: false,
      });
    } else {
      this.setState({
        expanded: true,
      });
    }
  }

  render() {
    const {
      classes, created, author,
    } = this.props;
    const { inputs, expanded, videoKey } = this.state;

    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

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

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded}>
          <ExpansionPanelSummary>
            <div className={classes.row}>
              <div className={classes.columnContainer}>
                <Typography className={classes.ratingViews}>
                  Автор:
                  {author}
                </Typography>
                <Typography className={classes.ratingViews}>
                  Создано:
                  {new Date(created).toLocaleDateString('en-EN', dateOptions)}
                </Typography>
              </div>
            </div>
            <div className={classes.row}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.columnButton}
                onClick={(event) => { event.preventDefault(); this.handleChange(expanded); }}
              >
                Оставить свой комментарий
              </Button>
            </div>

            <RatingViews videoKey={videoKey} />

          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            {Inputs}
          </ExpansionPanelDetails>
          <Divider />
          <ExpansionPanelActions>
            <Button size="small" color="primary" onClick={(event) => { event.preventDefault(); this.submitHandler(); }}>
              Оставить комментарий
            </Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    );
  }
}

ExpansionPanelVideo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExpansionPanelVideo);
