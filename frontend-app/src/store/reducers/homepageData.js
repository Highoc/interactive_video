import * as actionTypes from '../actionTypes';

const initialState = {
  hot: {},
  new: {},
  popular: {},
  subscriptions: {},

};

const fetchHot = (state, action) => ({
  ...state,
  hot: action.payload,
});

const fetchNew = (state, action) => ({
  ...state,
  new: action.payload,
});

const fetchPop = (state, action) => ({
  ...state,
  popular: action.payload,
});

const fetchSubs = (state, action) => ({
  ...state,
  subscriptions: action.payload,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_HOT: return fetchHot(state, action);
    case actionTypes.FETCH_NEW: return fetchNew(state, action);
    case actionTypes.FETCH_POP: return fetchPop(state, action);
    case actionTypes.FETCH_SUBS: return fetchSubs(state, action);
    default: return state;
  }
};

export default reducer;