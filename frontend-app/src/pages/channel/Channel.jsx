import React from 'react';

import { Switch, Route } from 'react-router-dom';
import CreateChannel from './CreateChannel/CreateChannel';
import ChannelView from './ChannelView/ChannelView';
import CreateVideo from './CreateVideo/CreateVideo';
import WatchVideo from './WatchVideo/WatchVideo';
import { PlaylistAdd, PlaylistEdit, PlaylistInfo } from '../playlist';

export const Channel = () => (
  <div>
    <Switch>
      <Route exact path="/channel/create" component={CreateChannel} />
      <Route exact path="/channel/:channelKey" component={ChannelView} />
      <Route exact path="/channel/:channelKey/create" component={CreateVideo} />
      <Route exact path="/channel/:channelKey/playlist/create" component={PlaylistAdd} />
      <Route exact path="/channel/:channelKey/playlist/:playlistKey/update" component={PlaylistEdit} />
      <Route exact path="/channel/:channelKey/playlist/:playlistKey" component={PlaylistInfo} />
      <Route exact path="/channel/:channelKey/watch/:videoKey" component={WatchVideo} />
    </Switch>
  </div>
);
