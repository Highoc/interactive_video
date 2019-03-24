import React from 'react';

import { Switch, Route } from 'react-router-dom';
import CreateChannel from './CreateChannel';
import ChannelView from './ChannelView';
import CreateVideo from './CreateVideo';
import WatchVideo from './WatchVideo';
import ChannelEdit from './ChannelEdit';
import PlaylistAdd from './PlaylistAdd';
import PlaylistAll from './PlaylistAll';
import Playlist from './Playlist';
import PlaylistEdit from './PlaylistEdit';

export const Channel = () => (
  <div>
    <Switch>
      <Route exact path="/channel/create" component={CreateChannel} />
      <Route exact path="/channel/:channelKey" component={ChannelView} />
      <Route exact path="/channel/:channelKey/edit" component={ChannelEdit} />
      <Route exact path="/channel/:channelKey/create" component={CreateVideo} />
      <Route exact path="/channel/:channelKey/playlist/create" component={PlaylistAdd} />
      <Route exact path="/channel/:channelKey/playlist/all" component={PlaylistAll} />
      <Route exact path="/channel/:channelKey/playlist/:playlistKey/update" component={PlaylistEdit} />
      <Route exact path="/channel/:channelKey/playlist/:playlistKey" component={Playlist} />
      <Route exact path="/channel/:channelKey/watch/:videoKey" component={WatchVideo} />
    </Switch>
  </div>
);
