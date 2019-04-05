import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoIcon from '@material-ui/icons/OndemandVideo';
import {
  GridListTile, GridListTileBar, IconButton, GridList,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './ChannelPlaylist.styles';
import date from "../../../../helpers/Date/date";


class ChannelPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist,
      channelKey: props.channelKey,
    };
  }

  render() {
    const { playlist, channelKey } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={5}>
          {playlist.video.map(video => (
            <GridListTile key={video.name} component={props => <Link to={`/channel/${channelKey}/watch/${video.key}`} {...props} />}>
              <img src={video.preview_url} alt={video.name} height="280px" width="160px" />
              <GridListTileBar
                title={video.name}
                subtitle={<span>создано:{date(video.created)}</span>}
                actionIcon={(
                  <IconButton className={classes.icon}>
                    <VideoIcon color="secondary" />
                  </IconButton>
)}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}


export default withStyles(styles)(ChannelPlaylist);
