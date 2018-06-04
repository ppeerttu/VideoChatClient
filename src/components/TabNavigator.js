import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { primary } from '../styles/common';


class TabNavigator extends React.Component {

  render() {

    const { screen, screens } = this.props;

    return (
      <View style={styles.layout}>
        {screens.map(x => <Icon
          name={x}
          key={x}
          size={35}
          type="font-awesome"
          color={ screen === x ? primary.dark : "#fff" }
          onPress={() => this.props.onChangePage(x)}
          underlayColor={primary.light}
        />)}
      </View>
    );
  }
}

export default TabNavigator;


const styles = StyleSheet.create({
  layout: {
    width: '100%',
    padding: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: primary.light
  }
});
