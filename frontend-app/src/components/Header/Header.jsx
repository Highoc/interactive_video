import React, { Component } from 'react';

import { connect } from 'react-redux';


import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';

import MenuIcon from '@material-ui/icons/Menu';


import { Link } from 'react-router-dom';
import { logout } from '../../actions/authorization';
import { openDrawer, closeDrawer } from '../../actions/buttonActions';


const styles = theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  buttonContainer: {
    position: 'relative',
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  buttonPlace: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
});


class Header extends Component {
  state = {
    anchorEl: null,
  };


  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      isAuthorized, username, onLogout, classes, onOpenDrawer, openDrawerStatus, onCloseDrawer,
    } = this.props;

    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);

    const HomePage = props => <Link to="/" {...props} />;
    const LoginPage = props => <Link to="/login" {...props} />;
    const RegisterPage = props => <Link to="/register" {...props} />;
    const AccountPage = props => <Link to="/account" {...props} />;

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem>Привет {username} </MenuItem>
        <MenuItem component={AccountPage} onClick={this.handleMenuClose}>Мой аккаунт</MenuItem>
      </Menu>
    );

    let buttons = (
      <div className={classes.buttonPlace}>
        <Button component={LoginPage} color="inherit" size="medium">Войти</Button>
        <Button component={RegisterPage} color="inherit" size="medium">Регистрация</Button>
      </div>
    );

    if (isAuthorized) {
      buttons = <Button onClick={(event) => { onLogout(event); }} component={HomePage} color="inherit">Выйти</Button>;
    }


    return (
      <div className={classes.root}>
        <AppBar
          position="static"
        >
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={(event) => { openDrawerStatus ? onCloseDrawer(event) : onOpenDrawer(event); }}
            >
              <MenuIcon />
            </IconButton>
            <Button component={HomePage} color="inherit" size="large">InterVideo</Button>


            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                  fullWidth: true,
                }}
              />
            </div>
            <div className={classes.grow} />

            <div className={classes.buttonContainer}>
              {buttons}
            </div>
            <div className={classes.sectionDesktop}>

              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.token !== null,
  username: state.authorization.username,
  openDrawerStatus: state.buttonsAct.openDrawer,
});

const mapDispatchToProps = dispatch => ({
  onLogout: (event) => {
    event.preventDefault();
    dispatch(logout());
  },
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));
