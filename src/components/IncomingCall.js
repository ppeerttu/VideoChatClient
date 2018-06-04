import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { danger, secondary } from '../styles/common';


class IncomingCall extends React.Component {

  render() {
    const { username, onAnswer, onDecline, style } = this.props;
    return (
      <View style={style || {}}>
        <Card title="Incoming call" style={{ zIndex: 100 }}>
          <Text style={{ marginBottom: 10 }}>
            {username} is calling to you.
          </Text>
          <View style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row' }}>
            <Button
              title="Accept"
              buttonStyle={styles.acceptBtn}
              onPress={() => onAnswer()}
            />
            <Button
              title="Decline"
              buttonStyle={styles.declineBtn}
              onPress={() => onDecline()}
            />
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  acceptBtn: {
    backgroundColor: secondary.dark
  },
  declineBtn: {
    backgroundColor: danger.default
  }
});

export default IncomingCall;
