import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';

class ChatScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Chat screen</Text>
      </View>
    );
  }
}


export default connect()(ChatScreen);


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
