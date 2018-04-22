import React from 'react';
import {
  StackNavigator,
  addNavigationHelpers
} from 'react-navigation';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import MainScreen from './screens/MainScreen';
import { connect } from 'react-redux';

// Configure listener

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.navigation // <-- make sure this is where your nav state lives (i.e. if your redux state is at `state.nav` use state => state.nav instead)
);
const addListener = createReduxBoundAddListener("root");

export const AppStack = new StackNavigator({ Main: { screen: MainScreen }});

class Nav extends React.Component {
  render() {
    return (
      <AppStack
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigation,
          addListener
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  navigation: state.navigation,
})

export default connect(mapStateToProps)(Nav);
