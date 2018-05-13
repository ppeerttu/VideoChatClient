import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAILED,
  REQUEST_LOGOUT,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_LOGOUT_FAILED
} from '../actions/types';

const initialSession = {
  loggedIn: false,
  isPending: false,
  user: {}
};

const session = (state = initialSession, action) => {
  if (
    !action
    || !action.type
  ) throw new Error('Received invalid redux action: no action or property action.type found!');
  switch (action.type) {
    case REQUEST_LOGIN:
    case REQUEST_LOGOUT:
      return Object.assign({}, state, {
        isPending: true
      });
    case REQUEST_LOGIN_SUCCESS:
      return Object.assign({}, {
        loggedIn: true,
        isPending: false,
        user: action.res.user
      });
    case REQUEST_LOGOUT_SUCCESS:
      return Object.assign({}, {
        loggedIn: false,
        isPending: false
      });
    case REQUEST_LOGIN_FAILED:
    case REQUEST_LOGOUT_FAILED:
      return Object.assign({}, state, {
        isPending: false
      });
    default:
      return state;
  }
};

export default session;
