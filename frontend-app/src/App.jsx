import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

import Header from './components/Header';
import MenuLeft from './components/MenuLeft';
import ConstructPanelLeft from './components/ConstructPanelLeft';
import { Main } from './components/Main';
import Homepage from './pages/homepage/Homepage';
import { Account } from './pages/account';
import { Channel } from './pages/channel';
import SignIn from './pages/login/SignIn';
import Register from './pages/register/Register';
import { Test } from './pages/test';

import Centrifugo from './components/Centrifugo';

import { loginCheckState } from './actions/authorization';



const Guest = props => <div> Гостевая страница </div>;


class App extends Component {

  componentDidMount() {
    const { onTryAutoLogin } = this.props;
    onTryAutoLogin();
  }

  render() {

    let components = (
      <Switch>
        <Route path="/guest" exact component={Guest} />
        <Route path="/login" exact component={SignIn} />
        <Route path="/register" exact component={Register} />
        <Route path="/test" component={Test} />
        <Redirect to="/guest" />
      </Switch>
    );

    let routes = <div />;

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
        <Switch>
          <Route
            path="/channel/:channelKey/create"
            exact
            render={props => (
              <div>
                <ConstructPanelLeft />
              </div>
            )}
          />

          <Route
            path="/"
            render={props => (
              <div>
                <MenuLeft />
                <Centrifugo />
              </div>
            )}
          />

        </Switch>
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
