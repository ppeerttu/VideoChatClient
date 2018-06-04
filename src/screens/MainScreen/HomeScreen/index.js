import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { primary } from '../../../styles/common';


class HomeScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Icon
          name="home"
          type="font-awesome"
          color={primary.default}
          size={75}
        />
      </View>
    );
  }
}


export default connect()(HomeScreen);


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
