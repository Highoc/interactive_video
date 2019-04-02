import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Fab from '@material-ui/core/Fab/index';
import NavigationIcon from '@material-ui/icons/Navigation';
import Input from '../../../components/Input/Input';
import { json, RequestResolver } from '../../../helpers/RequestResolver';
import styles from './CreateChannel.styles';
import { perror, pprint } from '../../../helpers/SmartPrint';
import { Redirect } from "react-router-dom";
import { addChannel } from '../../../store/actions/authorization';
import {connect} from "react-redux";

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isValid: false,
      inputs: [],
      channelKey: '',
      isSent: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('channel/update/');
      this.setState({ isLoaded: true, inputs: result.data });
    } catch (error) {
      perror('CreateChannel', error);
    }
  }

  getData() {
    const { inputs } = this.state;
    const result = {};
    inputs.map((input) => { result[input.name] = input.value; return 0; });
    return result;
  }

  async submitHandler() {
    const { inputs } = this.state;
    const { addChannel } = this.props;
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }

    if (isValid) {
      try {
        const data = this.getData();
        const result = await this.backend(json).post('channel/update/', data);
        pprint('CreateChannel', result.data);
        addChannel(result.data.key);
        this.setState({ isSent: true, channelKey: result.data.key });
      } catch (error) {
        perror('CreateChannel', error);
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
    const { inputs, isLoaded, isSent, channelKey } = this.state;
    const { classes } = this.props;

    if (isSent) {
      return <Redirect to={`/channel/${channelKey}`} />;
    }

    if (!isLoaded) {
      return <div>Загружается</div>;
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
          <h2>Создание канала</h2>
          {Inputs}
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            style={styles.button}
            onClick={event => this.submitHandler()}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Создать
          </Fab>
        </form>
      </div>
    );
  }
}

CreateChannel.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
});

const mapDispatchToProps = dispatch => ({
  addChannel: channelKey => dispatch(addChannel(channelKey)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CreateChannel));
