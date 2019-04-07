import React from 'react';
import { Link } from 'react-router-dom';
import date from '../../../../helpers/Date/date';
import '../HomeList.scss';
import { Typography } from "@material-ui/core";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderDesc = this.renderDesc.bind(this);
    this.renderPic = this.renderPic.bind(this);
  }

  renderTitle = (title) => {
    if (title.length < 20) {
      return <Typography variant="display2" className="search-tile-title">{title}</Typography>;
    }
    if (title.length < 35) {
      return <Typography variant="display2" className="search-tile-title long-title">{title}</Typography>;
    }
    return <Typography variant="display2" className="search-tile-title longer-title">{title}</Typography>;
  };

  renderDesc = (desc) => {
    if (desc.length > 150) {
      // eslint-disable-next-line no-param-reassign
      desc = desc.substring(0, 135);
      return (
        <Typography variant="display3" className="tile-desc">
          {desc}
          {' '}
... read more
        </Typography>
      );
    }
    return <Typography variant="display3" className="tile-desc">{desc}</Typography>;
  };

  renderPic = movie => (
    <img
      alt="img"
      className="tile-img"
      src={movie.preview_url}
    />
  );

  render() {
    const { movie, channelKey } = this.props;
    return (
      <Link className="tile" to={`/channel/${channelKey}/watch/${movie.key}`}>
        <div className="tile-img">{this.renderPic(movie)}</div>
        <div className=" photo-overlay">
          <div className="tile-text-container">
            <div className="playbtn-container">
              <button className="playBtn ">▶</button>
            </div>
            <div>{this.renderTitle(movie.name)}</div>
            <div>{this.renderDesc(date(movie.created))}</div>
          </div>
        </div>
      </Link>
    );
  }
}


export default ListItem;
