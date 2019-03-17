import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { ChannelView } from './ChannelView';
import CreateVideo from './CreateVideo';
import { WatchVideo } from './WatchVideo';
import { PlaylistAll } from './PlaylistAll';
import { Playlist } from './Playlist';
import CreateChannel from './CreateChannel';

export const Channel = () => (
  <div>
    <Switch>
      <Route exact path="/channel/create" component={CreateChannel} />
      <Route exact path="/channel/:channelKey" component={ChannelView} />
      <Route exact path="/channel/:channelKey/create" component={CreateVideo} />
      <Route exact path="/channel/:channelKey/playlist/all" component={PlaylistAll} />
      <Route exact path="/channel/:channelKey/playlist/:playlistKey" component={Playlist} />
      <Route exact path="/channel/:channelKey/watch/:videoKey" component={WatchVideo} />
    </Switch>
  </div>
);
