import * as actionTypes from '../actionTypes';
import { login } from './authorization';
import { RequestResolver } from '../../helpers/RequestResolver';
import SmartPrint from '../../helpers/SmartPrint/SmartPrint';

export const registrationStart = () => {
  return {
    type: actionTypes.REGISTRATION_START,
  };
};

export const registrationSuccess = () => {
  return {
    type: actionTypes.REGISTRATION_SUCCESS,
  };
};

export const registrationFailed = (error) => {
  return {
    type: actionTypes.REGISTRATION_FAILED,
    error,
  };
};

export const registration = (data) => {
  return (dispatch) => {
    dispatch(registrationStart());
    RequestResolver.getGuest()().post('core/user/sign_up/', data)
      .then((result) => {
        const { username, password1 } = data;
        dispatch(registrationSuccess());
        dispatch(login(username, password1));
      })
      .catch((error) => {
        SmartPrint.error('Registration', error);
        dispatch(registrationFailed(error));
      });
  };
};