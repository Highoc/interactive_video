import React from 'react';
import PropTypes from 'prop-types';
import { HugeVideoPreview, Carousel } from '..';

const ContentGenerator = ({ playlist }) => {
  const list = [];
  playlist.forEach((video, i) => {
    switch (i % 3) {
      case 0:
        list.push(<Carousel key={playlist.name} playlist={playlist} label={`Плейлист ${i}`} />);
        list.push(<HugeVideoPreview key={video.key} video={video} />);
        break;
      case 1:
        list.push(<HugeVideoPreview key={video.key} video={video} order="reverse" />);
        break;
      case 2:
        list.push(<HugeVideoPreview key={video.key} video={video} />);
        break;
      default:
        break;
    }
  });

  return (
    <div>
      {list}
    </div>
  );
};

export default ContentGenerator;

ContentGenerator.propTypes = {
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
};
