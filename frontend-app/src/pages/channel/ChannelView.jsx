import React from 'react';

export const ChannelView = props => (
  <div>
    Я смотрю канал {props.match.params.ch_id}!
  </div>
);
