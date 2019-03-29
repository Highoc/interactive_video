import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import GridList from '@material-ui/core/GridList';

const styles = theme => ({
  root: {
    marginTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
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
});

class ChannelPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist,
      channelKey: props.channelKey,
    };
  }

  render() {
    const { classes } = this.props;
    const { playlist, channelKey } = this.state;
    return (

      <div>
        <GridList cellHeight="auto" spacing={10} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">{playlist.name}</ListSubheader>
          </GridListTile>
          {playlist.video.map(video => (
            <GridListTile key={video.name} cols={0.4} rows={1} component={props => <Link to={`/channel/${channelKey}/watch/${video.key}`} {...props} />}>
              <img src={video.preview_url} alt={video.name} width="22%" height="100%" />
              <GridListTileBar
                title={video.name}
                actionIcon={
                  <IconButton className={classes.icon}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

ChannelPlaylist.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChannelPlaylist);
