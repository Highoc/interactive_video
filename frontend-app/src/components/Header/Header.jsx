import React, { Component } from 'react';

import { connect } from 'react-redux';

import { logout, login } from '../../actions/authorization';

class Header extends Component {
  render() {
    const styles = {
      color: '#FF8C00',
      backgroundColor: '#FF2D00',
      height: '70px',
      padding: '5px',
    };

    const { isAuthorized, username, onLogin, onLogout } = this.props;

    return (
      <header style={styles}>
        Хедер! Привет { username }!
        {
          isAuthorized ? <a onClick={onLogout}>Выйти</a> : <a onClick={onLogin}>Войти</a>
        }
      </header>
    );
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.token !== null,
  username: state.authorization.username,
});

const mapDispatchToProps = dispatch => ({
  onLogout: (event) => {
    event.preventDefault();
    dispatch(logout());
  },
  onLogin: (event) => {
    event.preventDefault();
    dispatch(login('admin', 'Ssdawz5566'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
