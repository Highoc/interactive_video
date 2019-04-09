import React from 'react';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import ListItem from './ListItem';
import "../HomeList.scss";

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      margin: 0,
      tilesCounter: props.movieList.video.length,
      movieList: props.movieList,
    };
  }

  renderMovieList = movieList => movieList.video.map(movie => <ListItem key={movie.key} movie={movie} channelKey={this.props.channelKey} />);

  handleLeftClick = (e) => {
    e.preventDefault();
    if (this.state.margin < 0) {
      this.setState({
        margin: this.state.margin + 350,
      });
      // eslint-disable-next-line
      const el = findDOMNode(this.refs.content);
      $(el).animate(
        {
          marginLeft: '+=350px',
        },
        'fast',
      );
    }
  };

  handleRightClick = (e) => {
    e.preventDefault();
    if (this.state.margin > (this.state.tilesCounter - 5) * -350) {
      this.setState({
        margin: this.state.margin - 350,
      });
      // eslint-disable-next-line
      const el = findDOMNode(this.refs.content);
      $(el).animate(
        {
          marginLeft: '-=350px',
        },
        'fast',
      );
    }
  };

  render() {
    const { movieList } = this.state;
    return (
      <div className="list-container">
        <div className="arrow-left" onClick={this.handleLeftClick} role="button">
          <div className="arrow-left-top" />
          <div className="arrow-left-bottom" />
        </div>

        <div className="module-section clearfix">
          {/* eslint-disable-next-line react/no-string-refs */}
          <ul id="content" ref="content">
            <div className="listRow">{this.renderMovieList(movieList)}</div>
          </ul>
        </div>

        <div className="arrow-right" onClick={this.handleRightClick} role="button">
          <div className="arrow-right-top" />
          <div className="arrow-right-bottom" />
        </div>
      </div>
    );
  }
}

export default MovieList;
