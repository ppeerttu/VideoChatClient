import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import apiMiddleware from '../middleware/restAPI';
import signalMiddleware from '../middleware/signalAPI';
import reducer from '../reducers';

const middlewares = [thunkMiddleware, apiMiddleware, signalMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export default function configureStore(initialState) {
  return compose(
    applyMiddleware(...middlewares)(createStore)(reducer, initialState)
  );
}
