import io from 'socket.io-client';
import { AsyncStorage } from 'react-native';
import config from '../config/index';
import {
  receiveMessageTypes,
  sendMessageTypes,
  OPEN_SOCKET,
  CLOSE_SOCKET,
  SOCKET_DISCONNECTED,
  SOCKET_CONNECTED,
  SOCKET_RECONNECTING,
  SOCKET_RECONNECT_ATTEMPT,
  SOCKET_RECONNECT_ERROR,
  SOCKET_RECONNECT_FAILED,
  SOCKET_CONNECT_ERROR,
  SOCKET_CONNECT_TIMEOUT
} from '../actions/types';

let socket;

/**
 * Initialize the socket object and set event listeners
 */
const init = async ( next ) => {

  let token = await getToken();

  socket = io(config.apiBaseUrl, {
    path: '/signal',
    transports: ['websocket'],
    reconnectionAttempts: 10,
    query: { token }
  });

  placeListenMiddleware(next);

};

const placeListenMiddleware = ( next ) => {

  Object.keys( receiveMessageTypes )
    .forEach( type => socket.on( receiveMessageTypes[type], ( payload ) =>
       next({ type, payload })
    )
  );

  socket.on('disconnect', reason => next({ type: SOCKET_DISCONNECTED, payload: { reason } }));
  socket.on('connect', () => next({ type: SOCKET_CONNECTED, payload: {} }));
  socket.on('connect_error', (reason) => next({ type: SOCKET_CONNECT_ERROR, payload: { reason } }));
  socket.on('connect_timeout', (args) => next({ type: SOCKET_CONNECT_TIMEOUT, payload: { args } }));
  socket.on('reconnect_attempt', (args) => next({ type: SOCKET_RECONNECT_ATTEMPT, payload: { args }}));
  socket.on('reconnecting', (count) => next({ type: SOCKET_RECONNECTING, payload: { count }}));
  socket.on('reconnect_error', (reason) => next({ type: SOCKET_RECONNECT_ERROR, payload: { reason }}));
  socket.on('reconnect_failed', (reason) => next({ type: SOCKET_RECONNECT_FAILED, payload: { reason }}));

};

const closeSocket = () => socket.disconnect(true);

/**
 * Emit a message
 */
const emit = ( type, payload ) => socket.emit( type, payload );


const getToken = async () => {
  let token;
  try {
    token = await AsyncStorage.getItem('@MyStore:token');
  } catch(e) {
    token = null;
  }
  return token;
};

const emitMessage = type => {
  if (Object.keys(sendMessageTypes).includes(type)) return true;
  return false;
};


/**
 * Redux Middleware for handling asynchronous API call flow
 */
export default () => next => action => {
  if (!action.signal) {
    return next(action);
  }

  const { type, payload } = action.signal;

  if (!type) {
    throw new Error('Signal type should be defined.');
  }
  if (!payload) {
    throw new Error('Signal payload should be defined.');
  }

  // Open socket and
  if (type === OPEN_SOCKET) {
    if (socket) next({ type, payload });
    else init(next);
  } else if (type === CLOSE_SOCKET) {
    closeSocket();
  }


  if (emitMessage(type)) {
    emit(sendMessageTypes[type], payload);
    return next({ type, payload });
  }

  return next({ type, payload });
};
