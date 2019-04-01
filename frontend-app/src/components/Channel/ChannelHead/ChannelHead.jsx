import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography,
} from '@material-ui/core';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import classes from './ChannelHead.module.css';
import { perror } from '../../../helpers/SmartPrint';
import date from '../../../helpers/Date/date';

class ChannelHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.channel,
      channelKey: props.channelKey,
      subStatus: props.channel.subscription.is_active,
    };
    this.backend = RequestResolver.getBackend();
  }

  async handleSubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      await this.backend(json).post(`channel/${channelKey}/subscribe/`, {});
      this.setState({ subStatus: true });
    } catch (error) {
      perror('ChannelHead', error);
    }
  }


  async handleUnsubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      await this.backend(json).post(`channel/${channelKey}/unsubscribe/`, {});
      this.setState({ subStatus: false });
    } catch (error) {
      perror('ChannelHead', error);
    }
  }

  render() {
    const { channel, channelKey, subStatus } = this.state;
    const MyLink = props => <Link to={`${channelKey}/playlist/all`} {...props} />;
    const Settings = props => <Link to={`${channelKey}/edit`} {...props} />;
    let subscribed = <Typography> Не подписан </Typography>;
    let button = <Button size="small" color="primary" onClick={event => this.handleSubscribe(event)}>Подписаться</Button>;

    if (subStatus) {
      subscribed = <Typography> Подписан </Typography>;
      button = <Button size="small" color="primary" onClick={event => this.handleUnsubscribe(event)}>Отписаться</Button>;
    }

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image="https://sun1-14.userapi.com/c855220/v855220546/3c4f/peP6UFrBniE.jpg"
            title={channel.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Создатель:
              {' '}
              {channel.owner.username}
              <br />
              Создан:
              {' '}
              {date(channel.created)}
              <br />
            </Typography>
            <Typography component="p" align="center">
              {channel.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" component={MyLink}>
            Посмотреть все плейлисты
          </Button>
          <Button size="small" color="primary" component={Settings}>
            Настройки канала
          </Button>
          {button}
          {subscribed}
        </CardActions>
      </Card>
    );
  }
}


export default ChannelHead;
