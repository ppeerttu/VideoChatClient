import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { danger } from '../styles/common';


class BottomBar extends React.Component {

  render() {
    const { onClose, inCall } = this.props;
    return (
      <View style={styles.bottomBar}>
        <Icon
          raised
          name={inCall ? 'call-end' : 'close'}
          type={inCall ? 'material-icons' : 'evil-icon'}
          color={inCall ? danger.default : 'black'}
          onPress={() => onClose()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    zIndex: 110,
    width: '100%'
  }
})

export default BottomBar;
