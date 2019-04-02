import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Fab from '@material-ui/core/Fab/index';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Redirect } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import { RequestResolver, multipart } from '../../../helpers/RequestResolver';
import styles from './PlaylistAdd.styles';
import { perror } from '../../../helpers/SmartPrint';

class PlaylistAdd extends Component {
  constructor(props) {
    super(props);
    const { channelKey } = props.match.params;
    this.state = {
      isValid: false,
      inputs: [],
      channelKey,
      isSent: false,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const { channelKey } = this.state;
    try {
      const result = await this.backend().get(`channel/${channelKey}/playlist/create/`);
      this.setState({ inputs: result.data, isLoaded: true });
    } catch (error) {
      perror('PlaylistAdd', error);
    }
  }

  getData() {
    const { inputs } = this.state;
    const result = new FormData();
    inputs.map((input) => { result.append(input.name, input.value); return 0; });
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
        const data = this.getData();
        await this.backend(multipart).post(`channel/${channelKey}/playlist/create/`, data);
        this.setState({ isSent: true });
      } catch (error) {
        perror('PlaylistAdd', error);
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
    if (state.file !== null) {
      input.value = state.file;
    }
    this.setState({ inputs });
  }

  render() {
    const { inputs, isSent, channelKey, isLoaded } = this.state;
    const { classes } = this.props;

    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }

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
      </div>
    );
  }
}

PlaylistAdd.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistAdd);
