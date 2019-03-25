import axios from 'axios';
import { backend as path } from '../urls';

import * as actionTypes from './actionTypes';


export const loginStart = () => ({
  type: actionTypes.LOGIN_START,
});

export const loginSuccess = (token, username) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: { token, username },
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

  axios.post(`http://${path}/auth/login/`, { username, password })
    .then((result) => {
      const { token, user } = result.data;
      localStorage.setItem('jwt-token', token);
      dispatch(loginSuccess(token, user.username));
    })
    .catch((error) => {
      console.log(error);
      dispatch(loginFailed(error));
    });
};

export const loginCheckState = () => (dispatch) => {
  dispatch(loginStart());
  const token = localStorage.getItem('jwt-token');
  if (token) {
    const url = `http://${path}/core/user/current/`;
    const config = {
      headers: {
        Authorization: `JWT ${token}`,
      },
    };
    axios.post(url, config)
      .then((result) => {
        const { username } = result.data;
        dispatch(loginSuccess(token, username));
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginFailed(error));
      });
  }
};
