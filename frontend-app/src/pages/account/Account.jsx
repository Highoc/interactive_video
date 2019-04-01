import React, { Component } from 'react';
import { RequestResolver } from '../../helpers/RequestResolver';
import { perror, pprint } from '../../helpers/SmartPrint';
import { Card, CardActionArea, CardMedia } from "@material-ui/core";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      isSent: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('core/profile/current/');
      pprint('Account', result.data);
      this.setState({ info: result.data, isLoaded: true });
    } catch (error) {
      perror('PlaylistEdit', error);
    }
  }
  /*
  getData() {
    const { inputs } = this.state;
    const result = {};
    inputs.map((input) => { result[input.name] = input.value; return 0; });
    return result;
  }

  async submitHandler() {
    const { inputs, channelKey, playlistKey } = this.state;
    let isValid = true;

    if (isValid) {
      try {

      } catch (error) {
        perror('PlaylistEdit', error);
      }
    } else {
      console.log('Invalid input');
    }
  }*/

  callbackInput(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    this.setState({ inputs });
  }

  render() {
    const { info } = this.state;


    return (
      <div>
        <h2>Ваш аккаунт</h2>
        <Card style={{ width: '100%', height: '500px' }}>
          <CardActionArea>
            <CardMedia
              style={{height: '500px', width: '100%' }}
              image={info.avatar_url}
            />
          </CardActionArea>ч
        </Card>
      </div>
    );
  }
}

export default Account;
