import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  RECEIVE_USERS,
  RECEIVE_CALL,
  RECEIVE_LEAVE,
  RECEIVE_CANDIDATE,
  RECEIVE_ANSWER,
  SEND_CALL,
  SEND_LEAVE,
  SEND_ANSWER,
  SEND_CANDIDATE
} from '../actions/types';

const callStates = {
  IDLE: 'IDLE',
  RINGING: 'RINGING',
  CONNECTED: 'CONNECTED',
  ALERTING: 'ALERTING'
};

const initialSignal = {
  connected: false,
  users: [],
  call: {
    state: callStates.IDLE,
    peer: {
      offer: null,
      answer: null,
      username: null
    },
    amICaller: null
  },
  iceCandidates: null
};

const signal = (state = initialSignal, action) => {
  const { type, payload } = action;
  switch (type) {
    case SOCKET_DISCONNECTED:
      return Object.assign({}, initialSignal);

    case SOCKET_CONNECTED:
      return Object.assign({}, state, { connected: true });

    case RECEIVE_USERS:
      return Object.assign({}, state, { users: payload.users });

    case RECEIVE_CALL:
      return Object.assign({}, state, {
        call: Object.assign({}, state.call, {
          state: callStates.RINGING,
          peer: Object.assign({}, state.call.peer, {
            offer: payload.offer,
            username: payload.username
          }),
          amICaller: false
        })
      });

    case RECEIVE_LEAVE:
      return Object.assign({}, state, {
        call: initialSignal.call
      });

    case RECEIVE_ANSWER:
      if (payload.answer) {
        return Object.assign({}, state, {
          call: {
            state: callStates.CONNECTED,
            peer: Object.assign({}, state.call.peer, {
              username: state.call.peer.username,
              answer: payload.answer
            }),
            amICaller: true
          }
        });
      }
      return Object.assign({}, state, {
        call: initialSignal.call
      });

    case RECEIVE_CANDIDATE:
      return Object.assign({}, state, {
        iceCandidates: (state.iceCandidates || []).concat([payload.candidate])
      });

    case SEND_CALL:
      return Object.assign({}, state, {
        call: {
          state: callStates.RINGING,
          peer: Object.assign({}, state.call.peer, {
            username: payload.username,
            offer: payload.offer
          }),
          amICaller: true
        }
      });

    case SEND_LEAVE:
      return Object.assign({}, state, {
        call: initialSignal.call
      });

    case SEND_ANSWER:
      if (!payload.answer) {
        return Object.assign({}, state, { call: initialSignal.call });
      }
      return Object.assign({}, state, {
        call: Object.assign({}, state.call, {
          state: callStates.CONNECTED,
          peer: Object.assign({}, state.call.peer, {
            answer: payload.answer
          })
        })
      });

    case SEND_CANDIDATE:
      return Object.assign({}, state);
    default:
      return Object.assign({}, state);
  }
};

export default signal;
