import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardMedia, CardContent, CardActionArea, Typography, Button, CardActions,
} from '@material-ui/core';
import { connect } from 'react-redux';
import classes from './ChannelPlaylistView.module.css';

class ChannelPlaylistView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist,
      channelKey: props.channelKey,
    };
  }

  onDelete() {
    const { playlist } = this.state;
    const { onDelete } = this.props;
    onDelete(playlist.key);
  }

  render() {
    const { playlist, channelKey } = this.state;
    const { myChannelKey } = this.props;
    const Edit = props => <Link to={`/channel/${channelKey}/playlist/${playlist.key}/update`} {...props} />;
    const chosenPlaylist = props => <Link to={`/channel/${channelKey}/playlist/${playlist.key}`} {...props} />;

    let deleteButton = <Button size="small" color="error" onClick={() => this.onDelete()}>Удалить</Button>;
    let changeButton = <Button size="small" color="error" component={Edit}>Изменить</Button>;
    if (myChannelKey !== channelKey) {
      deleteButton = <div />;
      changeButton = <div />;
    }
    if (playlist.status !== 0){
      deleteButton = <div />;
    }
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component={chosenPlaylist}
            className={classes.media}
            image={playlist.preview_url}
            title={playlist.name}
          />
          <CardContent className={classes.content}>
            <Typography gutterBottom variant="title" align="center">
              {playlist.name}
            </Typography>
          </CardContent>
          <CardActions className={classes.button}>
            {changeButton}
            {deleteButton}
          </CardActions>
        </CardActionArea>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  myChannelKey: state.authorization.channelKey,
});

export default connect(mapStateToProps)(ChannelPlaylistView);
