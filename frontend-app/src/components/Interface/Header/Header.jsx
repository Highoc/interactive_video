import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  AppBar, Toolbar, IconButton, Button, Typography,
} from '@material-ui/core';

import { Timeline } from '@material-ui/icons';

import { withStyles } from '@material-ui/core/styles';

import headerStyles from './styles/Header.styles';

import { openDrawer, closeDrawer } from '../../../store/actions/buttonActions';
import ProfileMenu from './ProfileMenu';
import SearchField from './SearchField';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  onSearch(text) {
    this.setState({ text });
  }

  render() {
    const {
      isAuthorized, classes,
    } = this.props;
    const { text } = this.state;

    const LoginPage = props => <Link to="/login" {...props} />;
    const RegisterPage = props => <Link to="/register" {...props} />;
    const HomePage = props => <Link to="/" {...props} />;
    const Search = props => <Link to={`/search/?text=${text}`} {...props} />;

    const authorization = (
      <div className={classes.buttonContainer}>
        <div className={classes.buttonPlace}>
          <Button component={LoginPage} color="inherit" size="medium" variant="outlined">Войти</Button>
          <Button component={RegisterPage} color="inherit" size="medium" variant="outlined" className={classes.register}>Регистрация</Button>
        </div>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              component={HomePage}
            >
              <Timeline color="secondary" fontSize="large" />
            </IconButton>
            <Typography variant="h6" color="inherit">
              ForkMe
            </Typography>

            <div className={classes.grow} />

            <SearchField onStateChange={data => this.onSearch(data)} />
            <Button component={Search} size="small" color="inherit" variant="outlined">Поиск</Button>

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
