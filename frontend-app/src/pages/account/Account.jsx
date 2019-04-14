import React, { Component } from 'react';
import {
  Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { RequestResolver } from '../../helpers/RequestResolver';
import { perror, pprint } from '../../helpers/SmartPrint';
import date from '../../helpers/Date/date';
import classes from './Account.module.css';

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
    let name = `Имя: ${info.first_name}`;
    let surname = `Фамилия: ${info.last_name}`;
    let email = `Почта:${info.email}`;
    let created = `Создан: ${date(info.date_joined)}`;
    if (info.first_name === '') {
      name = '';
    }
    if (info.last_name === '') {
      surname = '';
    }
    if (info.email === '') {
      email = '';
    }
    if (info.date_joined === '') {
      created = '';
    }

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.image}
              image={avatar}
            />
            <CardContent>
              <Typography gutterBottom variant="h4" align="center">
                {name}
              </Typography>
              <Typography gutterBottom variant="h4" align="center">
                {surname}
              </Typography>
              <Typography variant="h5" align="center">
                {email}
              </Typography>
              <Typography variant="h5" align="center">
                {created}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.button}>
            <Button size="small" color="secondary" component={EditAccount}>
              Изменить
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default Account;
