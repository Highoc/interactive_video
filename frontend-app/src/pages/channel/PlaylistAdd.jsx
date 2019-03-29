import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Redirect } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { backend as path } from '../../urls';


const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});


class PlaylistAdd extends Component {
  constructor(props) {
    super(props);
    const { channelKey } = props.match.params;
    this.state = {
      isValid: false,
      inputs: [],
      channelKey,
      isSent: false,
    };
  }

  async componentDidMount() {
    const { channelKey } = this.state;

    const url = `http://${path}/channel/${channelKey}/playlist/create/`;
    const config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
      },
    };

    try {
      const result = await axios.get(url, config);
      console.log(result.data);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      console.log(error);
    }
  }

  getData() {
    const { inputs } = this.state;
    const result = {};
    inputs.map((input) => { result[input.name] = input.value; return 0; });
    return result;
  }

  async submitHandler() {
    const { inputs, channelKey } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      try {
        const url = `http://${path}/channel/${channelKey}/playlist/create/`;
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

  render() {
    const { inputs, isSent, channelKey } = this.state;
    const { classes } = this.props;

    const status = <div>Не отправлено</div>;

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}/playlist/all`} />;
    }

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
      <div>
        <form>
          <h2>Создание плейлиста</h2>
          {Inputs}
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            style={styles.button}
            onClick={(event) => { event.preventDefault(); this.submitHandler(); }}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Создать
          </Fab>
        </form>
        {status}
      </div>
    );
  }
}

PlaylistAdd.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistAdd);
