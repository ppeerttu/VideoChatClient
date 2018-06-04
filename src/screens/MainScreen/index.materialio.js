import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import BottomNavigation, { IconTab } from 'react-native-material-bottom-navigation'
import { fetchUser } from '../../actions/api';
import {
  connectToSignalServer,
  disconnectFromSignalServer
} from '../../actions/signal';
import HomeScreen from './HomeScreen';
import UserScreen from './UserScreen';

class MainScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  tabs = [{
    key: 'home',
    icon: 'home',
    label: 'Home',
    barColor: '#388E3C',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  }, {
    key: 'chat',
    icon: 'camera',
    label: 'Chat',
    barColor: '#388E3C',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  },{
    key: 'profile',
    icon: 'person',
    label: 'Profile',
    barColor: '#388E3C',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  }];

  constructor(props) {
    super(props);
    const { session: { loggedIn, user }, navigation, dispatch } = props;
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
      activeTab: this.tabs[0]
    };
    dispatch(connectToSignalServer());
  }

  _navigateTo(screen) {
    this.props.navigation.navigate(screen);
  }

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon}/>
  )

  renderTab = ({ tab, isActive }) => (
    <IconTab
      isActive={isActive}
      key={tab.key}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  render() {
    const { activeTab } = this.state;
    console.log(activeTab);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          { activeTab.key === 'profile' && <UserScreen /> }
          { activeTab.key === 'home' && <HomeScreen /> }
        </View>
        <BottomNavigation
          onTabPress={activeTab => this.setState({ activeTab })}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    )
  }
}

const selector = (state) => {
  const { session } = state;
  return { session };
};

export default connect(selector)(MainScreen);
