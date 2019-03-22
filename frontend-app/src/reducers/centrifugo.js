import * as actionTypes from '../actions/actionTypes';

const initialState = {
  subscriptions: [],
};

const subscribeToChannel = (state, action) => {
  const { channel, callback } = action.payload;
  const subscription = {
    channel,
    callback,
    isActive: false,
    isNeeded: true,
  };

  return {
    ...state,
    subscriptions: [...state.subscriptions, subscription],
  };
};

const unsubscribeFromChannel = (state, action) => {
  const { channel } = action.payload;
  const subscriptions = state.subscriptions.filter(elem => elem.channel !== channel);
  const subscription = state.subscriptions.find(elem => elem.channel === channel);
  subscription.isNeeded = false;
  return {
    ...state,
    subscriptions: [...subscriptions, subscription],
  };
};

const activateSubscription = (state, action) => {
  const { channel, subscription } = action.payload;
  const subscriptions = state.subscriptions.filter(elem => elem.channel !== channel);
  const elem = state.subscriptions.find(now => now.channel === channel);
  subscription.isActive = true;
  subscription.subscription = subscription;
  return {
    ...state,
    subscriptions: [...subscriptions, elem],
  };
};

const deleteSubscription = (state, action) => {
  const { channel } = action.payload;
  const subscriptions = state.subscriptions.filter(elem => elem.channel !== channel);
  return {
    ...state,
    subscriptions,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBSCRIBE_TO_CHANNEL: return subscribeToChannel(state, action);
    case actionTypes.UNSUBSCRIBE_FROM_CHANNEL: return unsubscribeFromChannel(state, action);
    case actionTypes.ACTIVATE_SUBSCRIPTION: return activateSubscription(state, action);
    case actionTypes.DELETE_SUBSCRIPTION: return deleteSubscription(state, action);
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
