import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Typography, withStyles, GridList, GridListTile, ListSubheader, GridListTileBar, IconButton,
} from '@material-ui/core';

import { Info } from '@material-ui/icons';


import styles from './styles';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { playlist, classes, channelKey } = this.props;
    return (
      <div>
        <GridList cellHeight="auto" spacing={10} classes={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">
              <Typography variant="h1" color="textSecondary">{playlist.name} </Typography>
            </ListSubheader>
          </GridListTile>
          {playlist.video.map(video => (
            <GridListTile key={video.name} cols={0.4} rows={1} component={props => <Link to={`/channel/${channelKey}/watch/${video.key}`} {...props} />}>
              <img src={video.preview_url} alt={video.name} width="22%" height="100%" />
              <GridListTileBar
                title={video.name}
                actionIcon={(
                  <IconButton className={classes.icon}>
                    <Info color="secondary" />
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

export default withStyles(styles)(Playlist);

