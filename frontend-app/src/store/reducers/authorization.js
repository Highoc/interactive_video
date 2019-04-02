import * as actionTypes from '../actionTypes';

const initialState = {
  token: null,
  username: 'Guest',
  isAuthorized: false,
  isSuperUser: false,
  channelExists: false,
  channelKey: null,
  id: 0,

  loading: false,
  error: null,
};

const loginStart = (state, action) => ({
  ...state,
  token: null,

  loading: true,
  error: null,
});

const addChannel = (state, action) => ({
  ...state,

  channelExists: true,
  channelKey: action.payload.channelKey,
});

const loginSuccess = (state, action) => ({
  ...state,
  token: action.payload.token,
  username: action.payload.user.username,
  isSuperUser: action.payload.user.is_superuser,
  isAuthorized: true,
  channelExists: action.payload.user.channel.is_exist,
  channelKey: action.payload.user.channel.key,
  id: action.payload.user.id,

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

  id: 0,
  channelKey: null,
  isSuperUser: false,
  channelExists: false,
  isAuthorized: false,
  token: null,
  username: 'Guest',
});


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START: return loginStart(state, action);
    case actionTypes.LOGIN_SUCCESS: return loginSuccess(state, action);
    case actionTypes.LOGIN_FAILED: return loginFail(state, action);
    case actionTypes.LOGOUT: return logout(state, action);
    case actionTypes.ADD_CHANNEL: return addChannel(state,action);
    default: return state;
  }
};

export default reducer;
