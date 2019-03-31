import * as actionTypes from '../actionTypes';

const initialState = {
  token: null,
  username: 'Guest',

  loading: false,
  error: null,
};

const loginStart = (state, action) => ({
  ...state,
  token: null,

  loading: true,
  error: null,
});

const loginSuccess = (state, action) => ({
  ...state,
  token: action.payload.token,
  username: action.payload.username,

  loading: false,
  error: null,
});

const loginFail = (state, action) => ({
  ...state,
  token: null,

  loading: false,
  error: action.error,
});

const logout = (state, action) => ({
  ...state,

  token: null,
  username: 'Guest',
});


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START: return loginStart(state, action);
    case actionTypes.LOGIN_SUCCESS: return loginSuccess(state, action);
    case actionTypes.LOGIN_FAILED: return loginFail(state, action);
    case actionTypes.LOGOUT: return logout(state, action);
    default: return state;
  }
};

export default reducer;
