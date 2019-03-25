import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Input from '../Input/Input';
import axios from 'axios';
import { backend as path } from '../../urls';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';



const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(24),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  rightcolumn: {
    flexBasis: '16.5%',
  },
  columnButton: {
    marginLeft: '30%',
    marginRight: '30%',
  },
  buttonContainer: {
    marginLeft: '60%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

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
      console.log('Отправить можно');
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
    if (expanded)
    {
      this.setState({
        expanded: false,
      });
    }
    else {
      this.setState({
        expanded: true,
      });
    }
  }

  onReply(event, choice) {
    const { callback } = this.props;
    callback(choice);
    event.preventDefault();
  }

  render() {
    const { classes, description, created, author, rating, views, choice } = this.props;
    const { inputs, isSent, expanded } = this.state;

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
                  <IconButton color="secondary" className={classes.button} aria-label="Like" onClick={(event) => this.onReply(event, 1)}>
                    <ArrowDropUp fontSize={"large"} />
                  </IconButton>
                </div>
                <div>
                  <IconButton color="secondary" className={classes.button} aria-label="Like" onClick={(event) => this.onReply(event, -1)}>
                    <ArrowDropDown fontSize={"large"} />
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
