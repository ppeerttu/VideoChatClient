import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Card, Avatar } from 'react-native-elements';
import UserForm from '../../../components/UserForm';

class UserScreen extends React.Component {

  render() {
    const { user } = this.props.session;
    return (
      <View style={styles.container}>
        <Card
          containerStyle={styles.card}
          /*image={require('../../../assets/coffee-smartphone-desk-pen.jpg')}
          imageProps={{ resizeMode: 'contain' }}
          imageStyle={styles.image}*/
          title="PROFILE"
          >
          <View style={styles.avatarContainer}>
            <Avatar
              source={require('../../../assets/coffee-smartphone-desk-pen.jpg')}
              xlarge
              rounded
            />
          </View>

          <UserForm user={user} />
        </Card>

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
  },
  card: {
    width: '100%',
    top: 0,
    position: 'absolute',
    marginTop: 0,
    justifyContent: 'center'
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 5
  }
});
