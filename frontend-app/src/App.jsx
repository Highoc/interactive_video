import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.css';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import HeaderLayout from './components/Layouts/Header';
import { Main } from './components/Layouts/Main';
import { Left } from './components/Layouts/Left';
import { Right } from './components/Layouts/Right';


import MenuLeft from './components/Interface/MenuLeft';
import MenuRight from './components/Interface/MenuRight';
import ConstructPanelLeft from './components/VideoConstructor/ConstructPanelLeft';
import Header from './components/Interface/Header';
import Homepage from './pages/homepage/Homepage';
import Account from './pages/account/Account';
import EditAccount from './pages/account/Edit/EditAccount';
import { Channel } from './pages/channel';
import SignIn from './pages/login/SignIn';
import Register from './pages/register/Register';
import Test from './pages/test/Test';
import Guestpage from './pages/guest/Guestpage';
import Centrifugo from './components/Centrifugo';
import NotReady from './pages/notReady/NotReady';

import { loginCheckState } from './store/actions/authorization';
import ConstructPanelRight from './components/VideoConstructor/ConctructPanelRight';

import theme from './helpers/theme/theme';

class App extends Component {
  componentDidMount() {
    const { onTryAutoLogin } = this.props;
    onTryAutoLogin();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/guest" exact component={Guestpage} />
        <Route path="/login" exact component={SignIn} />
        <Route path="/register" exact component={Register} />
        <Redirect to="/guest" />
      </Switch>
    );

    let componentLeft = <div />;
    let componentRight = <div />;
    let centrifuge = <div />;

    const { isAuthorized } = this.props;
    if (isAuthorized) {
      routes = (
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/test" exact component={Test} />
          <Route exact path="/account/edit" component={EditAccount} />
          <Route path="/account" component={Account} />
          <Route path="/channel" component={Channel} />
          <Route path="/notready" component={NotReady} />
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

      centrifuge = <Centrifugo />;
    }

    return (
      <Router>
        <MuiThemeProvider theme={theme}>
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
                {centrifuge}
              </Main>
              <Right>
                {componentRight}
              </Right>
            </div>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
});

const initMapDispatchToProps = dispatch => ({
  onTryAutoLogin: () => dispatch(loginCheckState()),
});

export default connect(mapStateToProps, initMapDispatchToProps)(App);

App.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  onTryAutoLogin: PropTypes.func.isRequired,
};
