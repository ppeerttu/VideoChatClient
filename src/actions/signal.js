import {
  OPEN_SOCKET,
  CLOSE_SOCKET,
  SEND_CALL,
  SEND_LEAVE,
  SEND_ANSWER,
  SEND_CANDIDATE
} from './types.js';

export const connectToSignalServer = () => {
  return {
    signal: {
      type: OPEN_SOCKET,
      payload: {}
    }
  };
};

export const disconnectFromSignalServer = () => {
  return {
    signal: {
      type: CLOSE_SOCKET,
      payload: {}
    }
  };
};

export const callToPeer = (username, offer) => {
  return {
    signal: {
      type: SEND_CALL,
      payload: {
        username,
        offer
      }
    }
  };
};

export const leavePeer = () => {
  return {
    signal: {
      type: SEND_LEAVE,
      payload: {}
    }
  };
};

export const answerToPeer = (username, answer) => {
  return {
    signal: {
      type: SEND_ANSWER,
      payload: {
        username,
        answer
      }
    }
  };
};

export const sendCandidate = (username, candidate) => {
  return {
    signal: {
      type: SEND_CANDIDATE,
      payload: {
        username,
        candidate
      }
    }
  };
};
