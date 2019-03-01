import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { ChannelView } from './ChannelView';
import { CreateVideo } from './CreateVideo';
import { WatchVideo } from './WatchVideo';

export const Channel = () => (
  <div>
    <Switch>
      <Route exact path="/channel/:ch_id" component={ChannelView} />
      <Route exact path="/channel/:ch_id/create" component={CreateVideo} />
      <Route exact path="/channel/:ch_id/watch/:v_id" component={WatchVideo} />
    </Switch>
  </div>
);
