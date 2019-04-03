import * as actionTypes from '../actionTypes';

export const openDrawer = () => ({
  type: actionTypes.OPENDRAWER,
});

export const closeDrawer = () => ({
  type: actionTypes.CLOSEDRAWER,
});

export const uploadFile = (files) => ({
  type: actionTypes.UPLOADFILE,
  payload: { files },
});

export const buttonChoice = (choice) => ({
  type: actionTypes.BUTTONCHOICE,
  payload: { choice },
});