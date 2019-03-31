import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  IconButton, Menu, MenuItem, Typography,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import classes from './styles/ProfileMenu.module.css';
import { logout } from '../../../store/actions/authorization';


class ProfileMenu extends Component {
  state = {
    anchorElem: null,
    isOpen: false,
  };

  handleOpen = (event) => {
    this.setState({ anchorElem: event.currentTarget, isOpen: true });
  };

  handleClose = () => {
    this.setState({ anchorElem: null, isOpen: false });
  };

  render() {
    const { anchorElem, isOpen } = this.state;
    const { username, onLogout } = this.props;

    const AccountPage = props => <Link to="/account" {...props} />;
    const GuestPage = props => <Link to="/guest" {...props} />;

    return (
      <div className={classes.row}>
        <Typography variant="h6" color="inherit">
          {username}
        </Typography>
        <div>
          <IconButton
            aria-owns={isOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorElem}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isOpen}
            onClose={this.handleClose}
          >
            <MenuItem component={AccountPage} onClick={this.handleClose}>Мой аккаунт</MenuItem>
            <MenuItem component={GuestPage} onClick={onLogout}>Выйти</MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.authorization.username,
});

const mapDispatchToProps = dispatch => ({
  onLogout: (event) => {
    event.preventDefault();
    dispatch(logout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
