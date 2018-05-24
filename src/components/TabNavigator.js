import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { primary } from '../styles/common';


class TabNavigator extends React.Component {

  render() {

    const { screen, screens } = this.props;

    return (
      <View style={styles.layout}>
        {screens.map(x => <Button
          icon={<Icon
            name={x}
            size={35}
            type="font-awesome"
            color={ screen === x ? primary.dark : primary.light }
          />}
          onPress={() => this.props.onChangePage(x)}
          key={x}
          title={null}
          buttonStyle={styles.button}
        />)}
      </View>
    );
  }
}

export default connect()(TabNavigator);


const styles = StyleSheet.create({
  layout: {
    width: '100%',
    padding: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    bottom: 0,
    position: 'absolute'
  },
  button: {
    backgroundColor: '#fff',
    padding: 10
  }
});
