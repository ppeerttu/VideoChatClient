import { AppStack } from '../AppNavigator'
import { NavigationActions } from 'react-navigation'

const initialAction = { type: NavigationActions.Init }
const initialState = AppStack.router.getStateForAction(initialAction)

export default (state = initialState, action) => {
  return AppStack.router.getStateForAction(action, state);
}
