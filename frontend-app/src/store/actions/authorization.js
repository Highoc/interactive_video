import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint } from '../../helpers/SmartPrint';
import * as actionTypes from '../actionTypes';


export const loginStart = () => ({
  type: actionTypes.LOGIN_START,
});

export const loginSuccess = (token, user) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: { token, user },
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

  RequestResolver.getGuest()().post('auth/login/', { username, password })
    .then((result) => {
      const { token, user } = result.data;
      pprint('login', user);
      localStorage.setItem('jwt-token', token);
      dispatch(loginSuccess(token, user));
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
    RequestResolver.getBackend()().get('core/user/current/')
      .then((result) => {
        const user = result.data;
        dispatch(loginSuccess(token, user));
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginFailed(error));
      });
  }
};
