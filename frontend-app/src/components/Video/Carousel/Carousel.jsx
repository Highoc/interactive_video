import React from 'react';
import PropTypes from 'prop-types';

import { findDOMNode } from 'react-dom';
import $ from 'jquery';

import {Typography, withStyles} from '@material-ui/core';
import SmallVideoPreview from '../SmallVideoPreview/SmallVideoPreview';

import styles from './styles';
import './animation.css';

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      margin: 0,
      counter: props.playlist.length,
    };
  }

  onLeftClick(event) {
    event.preventDefault();
    const { margin } = this.state;
    if (margin < 0) {
      this.setState({
        margin: margin + 280,
      });

      // eslint-disable-next-line
      const el = findDOMNode(this.refs.content);
      $(el).animate(
        {
          marginLeft: '+=280px',
        },
        'fast',
      );
    }
  }

  onRightCLick(event) {
    event.preventDefault();
    const { margin, counter } = this.state;
    if (margin > (counter - 4) * -280) {
      this.setState({
        margin: margin - 280,
      });

      // eslint-disable-next-line
      const elem = findDOMNode(this.refs.content);
      $(elem).animate(
        {
          marginLeft: '-=280px',
        },
        'fast',
      );
    }
  }

  render() {
    const { playlist, classes, label } = this.props;
    return (
      <div className={classes.root}>
        <Typography color="textSecondary" className={classes.label}>{label}</Typography>
        <div className="arrow-left" onClick={event => this.onLeftClick(event)} role="button">
          <div className="arrow-left-top" />
          <div className="arrow-left-bottom" />
        </div>
        <div className={classes.content} ref="content">
          {playlist.map(video => <SmallVideoPreview key={video.key} video={video} />)}
        </div>
        <div className="arrow-right" onClick={event => this.onRightCLick(event)} role="button">
          <div className="arrow-right-top" />
          <div className="arrow-right-bottom" />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Carousel);

Carousel.propTypes = {
  playlist: PropTypes.arrayOf(PropTypes.shape(
    {
      name: PropTypes.string,
      description: PropTypes.string,
      preview_url: PropTypes.string,
      created: PropTypes.string,
      rating: PropTypes.number,
      views: PropTypes.number,
      channel: PropTypes.shape({
        name: PropTypes.string,
        key: PropTypes.string,
      }),
      key: PropTypes.string,
    },
  )).isRequired,
  label: PropTypes.string.isRequired,
};
