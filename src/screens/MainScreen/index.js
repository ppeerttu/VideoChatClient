import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import TabNavigator from '../../components/TabNavigator';
import { fetchUser } from '../../actions';
import HomeScreen from '../HomeScreen';
import UserScreen from '../UserScreen';
import ChatScreen from '../ChatScreen';

const screens = ['home', 'wechat', 'user'];

class MainScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    const { user, session: { loggedIn }, navigator, dispatch } = props;
    if (!loggedIn) navigator.navigate('Home');
    if (
      Object.keys(user).length === 0
      || !user.expires
      || user.expires < Date.now()
    ) {
      dispatch(fetchUser());
    }
    this.state = {
      screen: 'home'
    };
  }

  _changePage(page) {
    this.setState({
      screen: page
    });
  }

  render() {
    const { username, email } = this.props.user;
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
  const { session, user } = state;
  return { session, user };
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
