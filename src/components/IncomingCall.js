import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { danger, secondary } from '../styles/colorPalette';


class IncomingCall extends React.Component {

  render() {
    const { username, onAnswer, onDecline } = this.props;
    return (
      <View>
        <Card title="Incoming call">
          <Text style={{ marginBottom: 10 }}>
            {username} is calling to you.
          </Text>
          <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
            <Button
              title="Accept"
              backgroundColor={secondary.default}
              onPress={() => onAnswer()}
            />
            <Button
              title="Decline"
              backgroundColor={danger.default}
              onPress={() => onDecline()}
            />
          </View>
        </Card>
      </View>
    );
  }
}

export default IncomingCall;
