import React from 'react';

export const CreateVideo = props => (
  <div>
    Я создаю видео на канале {props.match.params.ch_id}!
  </div>
);
