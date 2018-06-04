import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import TabNavigator from '../../components/TabNavigator';
import { fetchUser } from '../../actions/api';
import {
  connectToSignalServer,
  disconnectFromSignalServer
} from '../../actions/signal';
import HomeScreen from './HomeScreen';
import UserScreen from './UserScreen';

const screens = ['home', 'wechat', 'user'];

class MainScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    const { session: { loggedIn, user }, navigation, dispatch, signal: { connected } } = props;
    if (!loggedIn) navigation.navigate('Auth');
    /*
    if (
      Object.keys(user).length === 0
      || !user.expires
      || user.expires < Date.now()
    ) {
      dispatch(fetchUser());
    }*/
    this.state = {
      screen: 'home'
    };
    if (!connected) dispatch(connectToSignalServer());
  }

  _changePage(page) {
    if (page === 'wechat') {
      this._navigateTo('Chat');
      return;
    }
    this.setState({
      screen: page
    });

  }

  _navigateTo(screen) {
    this.props.navigation.navigate(screen);
  }

  render() {
    const { user: { username, email }} = this.props.session;
    const { screen } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          { screen === 'user' && <UserScreen /> }
          { screen === 'home' && <HomeScreen /> }
        </View>
        <View style={styles.navigator}>
          <TabNavigator screen={screen} screens={screens} onChangePage={(page) => this._changePage(page)} />
        </View>
      </View>
    );
  }
}

const selector = (state) => {
  const { session, signal } = state;
  return { session, signal };
};

export default connect(selector)(MainScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  },
  navigator: {

  }
});
