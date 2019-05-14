import { RequestResolver } from '../../helpers/RequestResolver';
import { pprint, perror } from '../../helpers/SmartPrint';
import * as actionTypes from '../actionTypes';

export const fetchHot = () => async (dispatch) => {
  try {
    const response = await RequestResolver.getGuest()().get('core/top/?type=hot');
    pprint('FetchHot', response.data);
    const { data } = response;
    dispatch({
      type: actionTypes.FETCH_HOT,
      payload: data,
    });
  } catch (err) {
    perror('FetchHot', err);
  }
};

export const fetchNew = () => async (dispatch) => {
  try {
    const response = await RequestResolver.getGuest()().get('core/top/?type=new');
    pprint('FetchNew', response.data);
    const { data } = response;
    dispatch({
      type: actionTypes.FETCH_NEW,
      payload: data,
    });
  } catch (err) {
    perror('FetchNew', err);
  }
};

export const fetchPop = () => async (dispatch) => {
  try {
    const response = await RequestResolver.getGuest()().get('core/top/?type=popular');
    pprint('FetchPop', response.data);
    const { data } = response;
    dispatch({
      type: actionTypes.FETCH_POP,
      payload: data,
    });
  } catch (err) {
    perror('FetchPop', err);
  }
};

export const fetchSubs = () => async (dispatch) => {
  try {
    const response = await RequestResolver.getBackend()().get('core/top/subscriptions/');
    pprint('FetchSubs', response.data);
    const { data } = response;
    dispatch({
      type: actionTypes.FETCH_SUBS,
      payload: data,
    });
  } catch (err) {
    perror('FetchSubs', err);
  }
};
