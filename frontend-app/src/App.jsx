import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';
import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

import HeaderLayout from './components/Layouts/Header';
import { Main } from './components/Layouts/Main';
import { Left } from './components/Layouts/Left';
import { Right } from './components/Layouts/Right';
import { Footer } from './components/Layouts/Footer';

import MenuLeft from './components/Interface/MenuLeft';
import MenuRight from './components/Interface/MenuRight';
import ConstructPanelLeft from './components/VideoConstructor/ConstructPanelLeft';
import Header from './components/Interface/Header';
import Homepage from './pages/homepage/Homepage';
import { Account } from './pages/account';
import { Channel } from './pages/channel';
import SignIn from './pages/login/SignIn';
import Register from './pages/register/Register';

import Centrifugo from './components/Centrifugo';

import { loginCheckState } from './store/actions/authorization';
import ConstructPanelRight from './components/VideoConstructor/ConctructPanelRight';

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
    let routes = (
      <Switch>
        <Route path="/guest" exact component={Guest} />
        <Route path="/login" exact component={SignIn} />
        <Route path="/register" exact component={Register} />
        <Redirect to="/guest" />
      </Switch>
    );

    let componentLeft = <div />;
    let componentRight = <div />;

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

      componentLeft = (
        <Switch>
          <Route exact path="/channel/:channelKey/create" component={ConstructPanelLeft} />
          <Route path="/" component={MenuLeft} />
        </Switch>
      );
      componentRight = (
        <Switch>
          <Route exact path="/channel/:channelKey/create" component={ConstructPanelRight} />
          <Route path="/" component={MenuRight} />
        </Switch>
      );
    }

    return (
      <Router>
        <div className="content-column">
          <HeaderLayout>
            <Header />
          </HeaderLayout>
          <div className="content-row">
            <Left>
              {componentLeft}
            </Left>
            <Main>
              {routes}
            </Main>
            <Right>
              {componentRight}
            </Right>
          </div>
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
