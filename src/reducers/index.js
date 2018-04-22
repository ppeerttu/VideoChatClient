import { combineReducers } from 'redux';
import user from './user';
import session from './session';
import navigator from './navigator';

export default combineReducers({
  user,
  session,
  navigation: navigator
});
