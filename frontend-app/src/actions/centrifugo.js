import * as actionTypes from './actionTypes';

export const subscribeToChannel = (channel, callback) => ({
  type: actionTypes.SUBSCRIBE_TO_CHANNEL,
  payload: { channel, callback },
});

export const unsubscribeFromChannel = (channel) => ({
  type: actionTypes.UNSUBSCRIBE_FROM_CHANNEL,
  payload: { channel },
});

export const activateSubscription = (channel, subscription) => ({
  type: actionTypes.ACTIVATE_SUBSCRIPTION,
  payload: { channel, subscription },
});

export const deleteSubscription = (channel) => ({
  type: actionTypes.DELETE_SUBSCRIPTION,
  payload: { channel },
});
