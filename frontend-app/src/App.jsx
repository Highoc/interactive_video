import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';
import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

//import { Header } from './components/Layouts/Header';
import { Main } from './components/Layouts/Main';
import { Left } from './components/Layouts/Left';
import { Right } from './components/Layouts/Right';
import { Footer } from './components/Layouts/Footer';

import MenuLeft from './components/Interface/MenuLeft';
import ConstructPanelLeft from './components/VideoConstructor/ConstructPanelLeft';
import Header from './components/Interface/Header';
import Homepage from './pages/homepage/Homepage';
import { Account } from './pages/account';
import { Channel } from './pages/channel';
import SignIn from './pages/login/SignIn';
import Register from './pages/register/Register';

import Centrifugo from './components/Centrifugo';

import { loginCheckState } from './store/actions/authorization';

const Guest = props => <div> Гостевая страница </div>;


class App extends Component {
  componentDidMount() {
    const { onTryAutoLogin } = this.props;
    onTryAutoLogin();
  }
  /*
  render() {
    return (
      <Router>
        <div className="content-column">
          <Header />
          <div className="content-row">
            <Left>Неправо</Left>
            <Main>Мэйн<br/>>adwwad</Main>
            <Right>Право</Right>
          </div>
        </div>
      </Router>
    );
  }
  */
  render() {
    let components = (
      <Switch>
        <Route path="/guest" exact component={Guest} />
        <Route path="/login" exact component={SignIn} />
        <Route path="/register" exact component={Register} />
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
