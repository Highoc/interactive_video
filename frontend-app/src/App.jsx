import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

import Header from './components/Header';
import MenuLeft from './components/MenuLeft';
import MenuRight from './components/MenuRight';
import { Main } from './components/Main';

import { Homepage } from './pages/homepage';
import { Account } from './pages/account';
import { Channel } from './pages/channel';

import { Test } from './pages/test';

import Centrifugo from './components/Centrifugo';

import { loginCheckState } from './actions/authorization';

const Patch = props => <div />;
const Guest = props => <div> Гостевая страница </div>;

class App extends Component {
  componentDidMount() {
    const { onTryAutoLogin } = this.props;
    onTryAutoLogin();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/guest" exact component={Guest} />
        <Route path="/login" exact component={Patch} />
        <Route path="/register" exact component={Patch} />
        <Route path="/test" component={Test} />
        <Redirect to="/guest" />
      </Switch>
    );

    let components = <div />;

    const { isAuthorized } = this.props;
    if (isAuthorized) {
      routes = (
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/account" component={Account} />
          <Route path="/channel" component={Channel} />
          <Route path="/test" component={Test} />
          <Redirect to="/" />
        </Switch>
      );

      components = (
        <div>
          <MenuLeft />
          <MenuRight />
          <Centrifugo />
        </div>
      );
    }

    return (
      <Router>
        <div>
          <Header />
          {components}
          <Main>
            {routes}
          </Main>
          <Link to="/test">Test</Link>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.token !== null,
});

const initMapDispatchToProps = dispatch => ({
  onTryAutoLogin: () => dispatch(loginCheckState()),
});

export default connect(mapStateToProps, initMapDispatchToProps)(App);

App.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  onTryAutoLogin: PropTypes.func.isRequired,
};
