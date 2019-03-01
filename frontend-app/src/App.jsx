import React, { Component } from 'react';
import './App.css';

import { Header } from './components/Header';
import { MenuLeft } from './components/MenuLeft';
import { MenuRight } from './components/MenuRight';
import { Main } from './components/Main';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <MenuLeft />
        <MenuRight />
        <Main />
      </div>
    );
  }
}

export default App;
