import {
  SwitchNavigator
} from 'react-navigation';

import SignInScreen from './screens/SignInScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import MainScreen from './screens/MainScreen';
//import AppNavigator from './AppNavigator';

export default SwitchNavigator({
  AppLoading: AuthLoadingScreen,
  App: MainScreen,
  Auth: SignInScreen,
  Chat: ChatScreen
},
{
  initialRouteName: 'AppLoading'
});
