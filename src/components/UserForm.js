import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

class UserForm extends React.Component {

  render() {
    const { user } = this.props;
    return (
      <View>
        <Input
          placeholder="placeholder"
          shake
          value={user.username}
        />
        <Input
          placeholder="Email"
          shake
          value={user.email}
        />
        <Input
          placeholder="First name"
          shake
          value={user.firstName}
        />
        <Input
          placeholder="Last name"
          shake
          value={user.lastName}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

})

export default UserForm;
