import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography,
} from '@material-ui/core';
import { RequestResolver, json } from '../../../helpers/RequestResolver';
import classes from './ChannelHead.module.css';
import { perror } from '../../../helpers/SmartPrint';
import date from '../../../helpers/Date/date';
import {connect} from "react-redux";

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
    const { myChannelKey } = this.props;
    const MyLink = props => <Link to={`${channelKey}/playlist/all`} {...props} />;
    const Settings = props => <Link to={`${channelKey}/edit`} {...props} />;
    let button = <Button size="small" color="error" variant="outlined" onClick={event => this.handleSubscribe(event)}>Подписаться</Button>;
    let settings = <Button size="small" color="error" variant="outlined" component={Settings}>Настройки канала</Button>;
    if (myChannelKey !== channelKey){
      settings = <div />;
    }
    if (subStatus) {
      button = <Button size="small" color="error" variant="outlined" onClick={event => this.handleUnsubscribe(event)}>Отписаться</Button>;
    }

    return (
      <Card className={classes.card} color="primary">
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image="https://sun1-14.userapi.com/c855220/v855220546/3c4f/peP6UFrBniE.jpg"
            title={channel.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" align="center">
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
          <Button size="small" color="error" variant="outlined" component={MyLink}>
            Посмотреть все плейлисты
          </Button>
          {settings}
          {button}
        </CardActions>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  myChannelKey: state.authorization.channelKey,
});

export default connect(mapStateToProps)(ChannelHead);
