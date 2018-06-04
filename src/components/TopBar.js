import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import UserList from './UserList';


class TopBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showUsers: false
    };
  }

  _onShowUsers() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  render() {
    const { showUsers } = this.state;
    const { users, user, onCallToUser, onSwitchCamera } = this.props;
    return (
      <View style={styles.topBar}>
        <Icon
          name="users"
          type="font-awesome"
          containerStyle={styles.usersIcon}
          onPress={() => this._onShowUsers()}
          size={30}
          color="#fff"
          underlayColor="#000"
        />
        <View style={styles.usersContainer}>
          {
            showUsers &&
            <UserList
              users={users}
              user={user}
              onPress={(username) => onCallToUser(username)}
            />
          }
        </View>
        <Icon
          name="camera"
          type="font-awesome"
          containerStyle={styles.cameraIcon}
          onPress={() => onSwitchCamera()}
          size={30}
          color="#fff"
          underlayColor="#000"

        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraIcon: {
    zIndex: 100
  },
  usersIcon: {
    zIndex: 100
  },
  usersContainer: {
    position: 'absolute',
    paddingTop: 40,
    top: 0,
    left: 0,
    zIndex: 90,
    width: 300
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  }
})

export default TopBar;
