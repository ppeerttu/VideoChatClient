import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';

class UserScreen extends React.Component {

  render() {
    const { username, email, firstName, lastName } = this.props.session.user;
    return (
      <View style={styles.container}>
        { username && <Text>Username: {username}</Text> }
        { email && <Text>Email: {email}</Text> }
        { firstName && <Text>First name: {firstName}</Text> }
        { lastName && <Text>Last name: {lastName}</Text> }
      </View>
    );
  }
}

const selector = (state) => {
  const { session } = state;
  return { session };
};

export default connect(selector)(UserScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#fff',
    width: '100%'
  }
});
