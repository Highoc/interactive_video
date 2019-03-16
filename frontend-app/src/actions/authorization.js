import axios from 'axios';

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

  axios.post('http://172.20.10.6:8000/token-auth/', { username, password })
    .then((result) => {
      const { token, user } = result.data;
      console.log(result);
      localStorage.setItem('jwt-token', token);
      dispatch(loginSuccess(token, user.username));
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
