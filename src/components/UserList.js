import React from 'react';
import { View } from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';
import { danger, success } from '../styles/common';


class UserList extends React.Component {

  render() {
    const { user, onPress, users } = this.props;
    return (
      <View>
        <Card title="Users">
          {
            users.map((x, i) => {
              return (
                <ListItem
                  key={i}
                  title={x.username}
                  disabled={x.username === user.username ? true : false }
                  leftIcon={
                    <Icon
                      key={i}
                      name="user"
                      type="font-awesome"
                    />
                  }
                  rightIcon={
                    <Icon
                      key={`${i}-r`}
                      name="call"
                      type="material-icons"
                      color={x.state === 'IDLE' ? success.default : danger.default }
                    />
                  }
                  onPress={() => onPress(x.username)}
                />
              )
            })
          }
        </Card>
      </View>
    );
  }
}

export default UserList;
