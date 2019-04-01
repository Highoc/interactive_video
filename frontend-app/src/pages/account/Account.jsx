import React, { Component } from 'react';
import { RequestResolver } from '../../helpers/RequestResolver';
import { perror, pprint } from '../../helpers/SmartPrint';
import date from '../../helpers/Date/date';
import {
  Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button,
} from "@material-ui/core";
import {Link} from "react-router-dom";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      isSent: false,
      avatar: null,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    try {
      const result = await this.backend().get('core/profile/current/');
      pprint('Account', result.data);
      this.setState({ info: result.data, isLoaded: true, avatar: result.data.avatar_url });
    } catch (error) {
      perror('PlaylistEdit', error);
    }
  }

  render() {
    const { info, avatar } = this.state;
    const EditAccount = props => <Link to="/account/edit" {...props} />;

    return (
      <div>
        <h2>Ваш аккаунт</h2>
        <Card style={{ width: '100%', height: '700px' }}>
          <CardActionArea>
            <CardMedia
              style={{height: '500px', width: '100%' }}
              image={avatar}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {`Имя:${info.first_name}, ${info.last_name}  ` }
              </Typography>
              <Typography component="p">
                {`Почта:${info.email} Создан: ${date(info.date_joined)} `}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" component={EditAccount}>
              Изменить
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default Account;
