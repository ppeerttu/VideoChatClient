import { combineReducers } from 'redux';
import session from './session';
import signal from './signal';
//import navigator from './navigator';

export default combineReducers({
  session,
  signal,
  //navigation: navigator
});
