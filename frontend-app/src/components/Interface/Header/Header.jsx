import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  AppBar, Toolbar, IconButton, Button,
} from '@material-ui/core';

import { Menu as MenuIcon } from '@material-ui/icons';

import { withStyles } from '@material-ui/core/styles';

import headerStyles from './styles/Header.styles';

import { openDrawer, closeDrawer } from '../../../store/actions/buttonActions';
import ProfileMenu from './ProfileMenu';
import SearchField from './SearchField';

class Header extends Component {
  render() {
    const {
      isAuthorized, classes, onOpenDrawer, openDrawerStatus, onCloseDrawer,
    } = this.props;

    const LoginPage = props => <Link to="/login" {...props} />;
    const RegisterPage = props => <Link to="/register" {...props} />;
    const HomePage = props => <Link to="/" {...props} />;

    const authorization = (
      <div className={classes.buttonContainer}>
        <div className={classes.buttonPlace}>
          <Button component={LoginPage} color="inherit" size="medium">Войти</Button>
          <Button component={RegisterPage} color="inherit" size="medium">Регистрация</Button>
        </div>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={(event) => { openDrawerStatus ? onCloseDrawer(event) : onOpenDrawer(event); }}
            >
              <MenuIcon />
            </IconButton>

            <Button component={HomePage} color="inherit" size="large">InteractiveVideo</Button>

            <SearchField />

            <div className={classes.grow} />

            { isAuthorized ? <ProfileMenu /> : <div>{authorization}</div> }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
  openDrawerStatus: state.buttonsAct.openDrawer,
});

const mapDispatchToProps = dispatch => ({
  onOpenDrawer: (event) => {
    event.preventDefault();
    dispatch(openDrawer());
  },
  onCloseDrawer: (event) => {
    event.preventDefault();
    dispatch(closeDrawer());
  },
});

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(headerStyles)(connect(mapStateToProps, mapDispatchToProps)(Header));
