import React from 'react';
import ReactDOM from 'react-dom';

import {
  createStore, compose, applyMiddleware, combineReducers,
} from 'redux';

import { Provider } from 'react-redux';

import thunk from 'redux-thunk';

import authorizationReducer from './reducers/authorization';
import centrifugoReducer from './reducers/centrifugo';
import registrationReducer from './reducers/register';
import buttonsReducer from './reducers/buttonReducers';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const rootReducer = combineReducers({
  authorization: authorizationReducer,
  centrifugo: centrifugoReducer,
  reg: registrationReducer,
  buttonsAct: buttonsReducer,
});

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
/* eslint-enable */

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
