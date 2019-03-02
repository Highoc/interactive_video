import React, { Component } from 'react';
import './App.css';

import { Switch, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { MenuLeft } from './components/MenuLeft';
import { MenuRight } from './components/MenuRight';
import { Main } from './components/Main';

import { Guest } from './pages/guest';
import { Homepage } from './pages/homepage';
import { Account } from './pages/account';
import { Channel } from './pages/channel';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <MenuLeft />
        <MenuRight />
        <Main>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/guest" component={Guest} />
            <Route path="/account" component={Account} />
            <Route path="/channel" component={Channel} />
          </Switch>
        </Main>
      </div>
    );
  }
}

export default App;
