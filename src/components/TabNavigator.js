import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';



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
            color={ screen === x ? '#000' : '#9E9E9E' }
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
    backgroundColor: '#fff',
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
