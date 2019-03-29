import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Redirect } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { RequestResolver, json } from '../../helpers/RequestResolver';


const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});


class PlaylistEdit extends Component {
  constructor(props) {
    super(props);
    const { channelKey, playlistKey } = props.match.params;
    this.state = {
      isValid: false,
      inputs: [],
      channelKey,
      playlistKey,
      isSent: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const { channelKey, playlistKey } = this.state;
    try {
      const result = await this.backend().get(`channel/${channelKey}/playlist/${playlistKey}/update/`);
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
    const { inputs, channelKey, playlistKey } = this.state;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      try {
        const data = this.getData();
        const result = await this.backend(json).post(`channel/${channelKey}/playlist/${playlistKey}/update/`, data);
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
          <h2>Редактирование плейлиста</h2>
          {Inputs}
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            style={styles.button}
            onClick={event => this.submitHandler(event)}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Создать
          </Fab>
        </form>
      </div>
    );
  }
}

PlaylistEdit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistEdit);
