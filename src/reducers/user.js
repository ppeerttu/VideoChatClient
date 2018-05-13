/**
 * NOT USED AT THE MOMENT.
 * The user is within the session.
 */

import {
  REQUEST_USER_SUCCESS
} from '../actions/types';

const initialUser = {};

const user = (state = initialUser, action) => {
  if (
    !action
    || !action.type
  ) throw new Error('Received invalid redux action: no action or property action.type found!');
  switch (action.type) {
    case REQUEST_USER_SUCCESS:
      return Object.assign({}, action.res.user, { expires: Date.now() + (1000 * 60 * 60 * 8) });
    default:
      return state;
  }
};

export default user;
