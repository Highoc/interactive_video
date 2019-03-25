import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

import Header from './components/Header';
import MenuLeft from './components/MenuLeft';
import MenuRight from './components/MenuRight';
import ConstructPanelLeft from './components/ConstructPanelLeft';
import ConstructPanelRight from './components/ConctructPanelRight';
import { Main } from './components/Main';
import Homepage from './pages/homepage/Homepage';
import { Account } from './pages/account';
import { Channel } from './pages/channel';
import SignIn from './pages/login/SignIn';
import { Test } from './pages/test';

import Centrifugo from './components/Centrifugo';

import { loginCheckState } from './actions/authorization';


const Guest = props => <div> Гостевая страница </div>;
const Patch = props => <div />;


class App extends Component {
  componentDidMount() {
    const { onTryAutoLogin } = this.props;
    onTryAutoLogin();
  }

  render() {
    const styles = {
      rootleft: {
        padding: '5px',
        float: 'left',
        width: '15%',
        height: '600px',
      },
      rootRight: {
        padding: '5px',
        float: 'right',
        width: '15%',
        height: '600px',
      }
    };

    const LeftPatch = props => <div style={styles.rootleft} />;
    const RightPatch = props => <div style={styles.rootRight} />;

    let routes = (
      <Switch>
        <Route path="/guest" exact component={Guest} />
        <Route path="/login" exact component={SignIn} />
        <Route path="/register" exact component={Patch} />
        <Route path="/test" component={Test} />
        <Redirect to="/guest" />
      </Switch>
    );

    let components = (
      <div>
        <LeftPatch />
        <RightPatch />
      </div>
    );

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
                <ConstructPanelRight />
              </div>
            )}
          />

          <Route
            path="/"
            render={props => (
              <div>
                <MenuLeft />
                <MenuRight />
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
