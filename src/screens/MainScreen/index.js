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
import ChatScreen from './ChatScreen';

const screens = ['home', 'wechat', 'user'];

class MainScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    const { session: { loggedIn, user }, navigator, dispatch } = props;
    if (!loggedIn) navigator.navigate('Auth');
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
    dispatch(connectToSignalServer());
  }

  _changePage(page) {
    this.setState({
      screen: page
    });
  }

  render() {
    const { user: { username, email }} = this.props.session;
    const { screen } = this.state;
    return (
      <View style={styles.container}>
        { screen === 'user' && <UserScreen /> }
        { screen === 'home' && <HomeScreen /> }
        { screen === 'wechat' && <ChatScreen /> }
        <TabNavigator screen={screen} screens={screens} onChangePage={(page) => this._changePage(page)} />
      </View>
    );
  }
}

const selector = (state) => {
  const { session } = state;
  return { session };
};

export default connect(selector)(MainScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
});
