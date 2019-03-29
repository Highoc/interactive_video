import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { backend as path } from '../../urls';


const styles = theme => ({
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  card: {
    width: '100%',
  },
  media: {
    height: 150,
  },
});

class ChannelHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.channel,
      channelKey: props.channelKey,
      subStatus: false,
    };
  }

  async handleSubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      const url = `http://${path}/channel/${channelKey}/subscribe/`;
      const configs = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      };
      const result = await axios.post(url, {}, configs);
      this.setState({ subStatus: true });
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }


  async handleUnsubscribe(event) {
    event.preventDefault();
    try {
      const { channelKey } = this.state;
      const url = `http://${path}/channel/${channelKey}/unsubscribe/`;
      const configs = {
        headers: {
          Authorization: `JWT ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      };
      const result = await axios.post(url, {}, configs);
      this.setState({ subStatus: false });
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  render() {
    const { classes } = this.props;
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
              {channel.created}
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

ChannelHead.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelHead);
