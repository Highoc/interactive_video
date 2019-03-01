import React from 'react';

export const WatchVideo = props => (
  <div>
    Я смотрю видео {props.match.params.v_id} на канале {props.match.params.ch_id}
  </div>
);
