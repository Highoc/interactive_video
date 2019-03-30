import React, { Component } from 'react';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import ChannelPlaylist from '../../components/ChannelPlaylist';
import Typography from '@material-ui/core/Typography';
import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
    marginTop: '2%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
});


class Homepage extends Component {
  constructor(props) {
    super(props);

    const channelKey = 'adminadmin00';
    this.state = {
      channelKey,
      channel: null,
      isLoaded: false,
    };
    this.backend = RequestResolver.getBackend();
  }

  async componentDidMount() {
    const channelKey = 'adminadmin00';
    try {
      const result = await this.backend().get(`channel/get/${channelKey}/`);
      this.setState({ isLoaded: true, channel: result.data });
      pprint('HomePage', result.data);
    } catch (error) {
      perror('HomePage', error);
    }
  }

  render() {
    const { isLoaded } = this.state;
    const { classes } = this.props;
    let result;
    if (!isLoaded) {
      return <div> Еще не загружено </div>;
    }
    /*
    * Создать / Изменить / Удалить канал
    * */
    const { channel, channelKey } = this.state;

    if (isLoaded) {
      result = (
        <div className={classes.root}>
          <Typography className={classes.heading} variant="h4">
            Тренды:
          </Typography>
          <div>
            <ChannelPlaylist playlist={channel.uploaded_playlist} channelKey={channelKey} />
          </div>
          <div>
            <Typography className={classes.heading} variant="h4">
              Подписки:
            </Typography>
          </div>
          <div>
            <ChannelPlaylist playlist={channel.uploaded_playlist} channelKey={channelKey} />
          </div>
        </div>
      );
    }
    else {
      result = <div> Еще не загружено </div>;
    }

    return (
      result
    );
  }
}

Homepage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Homepage);
