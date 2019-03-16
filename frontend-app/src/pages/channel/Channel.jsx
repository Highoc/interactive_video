import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { ChannelView } from './ChannelView';
import CreateVideo from './CreateVideo';
import { WatchVideo } from './WatchVideo';
import CreateChannel from './CreateChannel';

export const Channel = () => (
  <div>
    <Switch>
      <Route exact path="/channel/:ch_id/view" component={ChannelView} />
      <Route exact path="/channel/:ch_id/create" component={CreateVideo} />
      <Route exact path="/channel/:ch_id/watch/:key" component={WatchVideo} />
      <Route exact path="/channel/create" component={CreateChannel} />
    </Switch>
  </div>
);
