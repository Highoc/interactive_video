import axios from 'axios';
import { backend as path } from '../urls';

import * as actionTypes from './actionTypes';


export const loginStart = () => ({
  type: actionTypes.LOGIN_START,
});

export const loginSuccess = (token, id, username) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: { token, username, id },
});

export const loginFailed = error => ({
  type: actionTypes.LOGIN_FAILED,
  error,
});

export const logout = () => {
  localStorage.removeItem('jwt-token');
  return {
    type: actionTypes.LOGOUT,
  };
};

export const login = (username, password) => (dispatch) => {
  dispatch(loginStart());

  axios.post(`http://${path}/token-auth/`, { username, password })
    .then((result) => {
      const { token, user } = result.data;
      localStorage.setItem('jwt-token', token);
      dispatch(loginSuccess(token, user.id, user.username));
    })
    .catch((error) => {
      console.log(error);
      dispatch(loginFailed(error));
    });
};

/*
export const loginCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      dispatch(loginSuccess(token, userId));
    }
  };
};
*/
