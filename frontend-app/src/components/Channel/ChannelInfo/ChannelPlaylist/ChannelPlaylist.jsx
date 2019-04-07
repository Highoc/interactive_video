/*import React from 'react';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import '../styles/ChannelPlaylist.scss';
import { Typography } from "@material-ui/core";


class ChannelPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      margin: 0,
      TOTAL_MARGIN: 8160,
      MOVIE_TILE_WIDTH: 340,
      playlist: props.playlist,
      channelKey: props.channelKey,
      playlistName: props.playlistName,
    };
  }

  handleLeftClick = (e) => {
    e.preventDefault();
    const { margin, MOVIE_TILE_WIDTH } = this.state;
    const { ChannelPlaylist } = this.refs;
    if (!margin) {
      return;
    }
    if (margin < MOVIE_TILE_WIDTH) {
      this.setState({
        margin: margin + MOVIE_TILE_WIDTH,
      });
      // eslint-disable-next-line
      const el = findDOMNode(ChannelPlaylist);
      $(el).animate(
        {
          marginLeft: `+=${MOVIE_TILE_WIDTH}px`,
        },
        'fast',
      );
    }
  };

  handleRightClick = (e) => {
    e.preventDefault();
    const { margin, MOVIE_TILE_WIDTH, TOTAL_MARGIN } = this.state;
    const { channelPlaylist } = this.refs;
    if (margin > -TOTAL_MARGIN) {
      this.setState({
        margin: margin - MOVIE_TILE_WIDTH,
      });
      // eslint-disable-next-line
      const el = findDOMNode(channelPlaylist);
      $(el).animate(
        {
          marginLeft: `-=${MOVIE_TILE_WIDTH}px`,
        },
        'fast',
      );
    }
  };

  render() {
    const {
      margin, TOTAL_MARGIN, playlist, playlistName, channelKey,
    } = this.state;
    return (
      <React.Fragment>
        <Typography variant="title">{playlistName}</Typography>
        <div className="playlist-list" ref="channelPlaylist">
          <span
            onClick={this.handleLeftClick}
            className="playlist-list__slider-btn playlist-list__slider-btn--left"
            role="button"
          >
            {margin ? (
              <i
                className="fa fa-angle-left playlist-list__slider-btn__icon"
                aria-hidden="true"
              />
            ) : (
              <i
                className="fa fa-angle-left playlist-list__slider-btn__icon playlist-list__slider-btn__icon--disable"
                aria-hidden="true"
              />
            )}
          </span>
          {playlist.video.map((movie, i) => (
            <VideoTile
              key={`playlist-${playlistName}-${i}`}
              movie={movie}
              channelKey={channelKey}
            />
          ))}
          <span
            onClick={this.handleRightClick}
            className="playlist-list__slider-btn playlist-list__slider-btn--right"
            role="button"
          >
            {margin > -TOTAL_MARGIN ? (
              <i
                className="fa fa-angle-right playlist-list__slider-btn__icon"
                aria-hidden="true"
              />
            ) : (
              <i
                className="fa fa-angle-right playlist-list__slider-btn__icon playlist-list__slider-btn__icon--disable"
                aria-hidden="true"
              />
            )}
          </span>
        </div>
      </React.Fragment>
    );
  }
}


export default ChannelPlaylist;
*/
/*
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoIcon from '@material-ui/icons/OndemandVideo';
import {
  GridListTile, GridListTileBar, IconButton, GridList,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles/ChannelPlaylist.styles';
import date from "../../../../helpers/Date/date";
import classNames from 'classnames';


class ChannelPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist,
      channelKey: props.channelKey,
      isHovered: false,
    };
  }

  onMouseOver(){
    this.setState({ isHovered: true });
  }
  onMouseOut(){
    this.setState({ isHovered: false });
  }

  render() {
    const { playlist, channelKey } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
          {playlist.video.map(video => (
              <img
                src={video.preview_url}
                alt={video.name}
                height="280px"
                width="160px"
                className={classNames(classes.img, this.state.isHovered && classes.transition)}
                onMouseOver={() => this.onMouseOver()}
                onMouseOut={() => this.onMouseOut()}
              />
          ))}
      </div>
    );
  }
}


export default withStyles(styles)(ChannelPlaylist);
*/

/*
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={5}>
          {playlist.video.map(video => (
            <GridListTile
              key={video.name}
              component={props => <Link to={`/channel/${channelKey}/watch/${video.key}`} {...props} />}
            >
              <img
                src={video.preview_url}
                alt={video.name}
                height="280px"
                width="160px"
                className={classNames(classes.img, this.state.isHovered && classes.transition)}
                onMouseOver={() => this.onMouseOver()}
                onMouseOut={() => this.onMouseOut()}
              />
              <GridListTileBar
                title={video.name}
                subtitle={<span>создано:{date(video.created)}</span>}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
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
 */
