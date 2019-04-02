import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InfoIcon from '@material-ui/icons/Info';
import {
  GridListTile, GridListTileBar, ListSubheader, IconButton, GridList,
} from '@material-ui/core';
import classes from './ChannelPlaylist.module.css';


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
    return (
      <div>
        <GridList cellHeight="auto" spacing={10} classes={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">{playlist.name}</ListSubheader>
          </GridListTile>
          {playlist.video.map(video => (
            <GridListTile key={video.name} cols={0.4} rows={1} component={props => <Link to={`/channel/${channelKey}/watch/${video.key}`} {...props} />}>
              <img src={video.preview_url} alt={video.name} width="22%" height="100%" />
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


export default ChannelPlaylist;
