import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InfoIcon from '@material-ui/icons/Info';
import {
  GridListTile, GridListTileBar, IconButton, GridList,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './ChannelPlaylist.styles';
import "./ChannelPlaylist.module.css";


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
      <div className="root">
        <GridList className={classes.gridList} cols={4.5}>
          {playlist.video.map(video => (
            <GridListTile key={video.name} component={props => <Link to={`/channel/${channelKey}/watch/${video.key}`} {...props} />}>
              <img src={video.preview_url} alt={video.name} height="200px" width="280px" />
              <GridListTileBar
                title={video.name}
                actionIcon={(
                  <IconButton className={classes.icon}>
                    <InfoIcon />
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
