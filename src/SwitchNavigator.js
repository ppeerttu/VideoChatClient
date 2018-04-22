import {
  SwitchNavigator
} from 'react-navigation';

import SignInScreen from './screens/SignInScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import AppNavigator from './AppNavigator';

export default SwitchNavigator({
  AppLoading: AuthLoadingScreen,
  App: AppNavigator,
  Auth: SignInScreen
},
{
  initialRouteName: 'AppLoading'
});
