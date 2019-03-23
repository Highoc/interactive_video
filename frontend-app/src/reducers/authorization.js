import * as actionTypes from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('jwt-token'),
  username: 'Guest',
  id: -1,

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
  id: action.payload.id,

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
  id: -1,
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
