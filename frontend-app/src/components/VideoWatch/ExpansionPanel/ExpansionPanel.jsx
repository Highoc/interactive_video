import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import classNames from 'classnames';
import {
  ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Typography, IconButton, Button, Divider,
} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Input from '../../Input/Input';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import { perror } from '../../../helpers/SmartPrint';
import styles from './ExpansionPanel.styles';

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
      choice: props.choice,
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
        const result = await this.backend(json).post(`channel/${channelKey}/video/${videoKey}/comment/add/`, data);
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

  onReply(event, choice) {
    const { callback } = this.props;
    this.setState({ choice });
    callback(choice);
    event.preventDefault();
  }

  render() {
    const {
      classes, created, author, rating, views,
    } = this.props;
    const { inputs, expanded, choice } = this.state;

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
            <div className={classes.column}>
              <Typography className={classes.heading}>
                Автор:
                {author}
                <div>
                  <Typography className={classes.heading}>
                    Создано:
                    {created}
                  </Typography>
                </div>
              </Typography>
            </div>
            <div className={classes.column}>
              <Button variant="contained" color="secondary" className={classes.columnButton} onClick={(event) => { event.preventDefault(); this.handleChange(expanded); }}>
                Оставить свой комментарий
              </Button>
            </div>
            <div className={classes.rightcolumn}>
              <Typography className={classes.heading}>
                Рейтинг:
                {rating}
                <div>
                  <Typography className={classes.heading}>
                    Просмотров:
                    {views}
                  </Typography>
                </div>
              </Typography>
            </div>
            <div className={classes.rightcolumn}>
              <div className={classes.buttonContainer}>
                <div>
                  <IconButton
                    color="secondary"
                    className={classes.button}
                    aria-label="Like"
                    onClick={event => this.onReply(event, 1)}
                    disabled={choice === 1}
                  >
                    <ArrowDropUp fontSize="large" />
                  </IconButton>
                </div>
                <div>
                  <IconButton
                    color="secondary"
                    className={classes.button}
                    aria-label="Like"
                    onClick={event => this.onReply(event, -1)}
                    disabled={choice === -1}
                  >
                    <ArrowDropDown fontSize="large" />
                  </IconButton>
                </div>
              </div>
            </div>
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
