import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/store';
import SwitchNavigator from './src/SwitchNavigator';

const store = configureStore();

class App extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = ['Remote debugger'];
  }
  render() {

    return (
      <Provider store={ store }>
        <SwitchNavigator />
      </Provider>
    );
  }
}

export default App;
