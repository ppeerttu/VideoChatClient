import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import { login } from '../../actions';

class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: 'TestUser',
      password: ''
    };
    const { loggedIn } = props.session;
    if (loggedIn) props.navigation.navigate('App');
  }

  _onPressButton() {
    const { username, password } = this.state;
    this.props.dispatch(login(username, password));
  }

  componentWillReceiveProps(props) {
    const { loggedIn } = props.session;
    if (loggedIn) props.navigation.navigate('App');
  }

  render() {
    const { username, password } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Input
            placeholder="Username"
            ref={(el) => { this.username = el; }}
            onChangeText={(username) => this.setState({username})}
            value={username}
            inputContainerStyle={styles.input}
          />
          <Input
            placeholder="Password"
            ref={(el) => { this.password = el; }}
            onChangeText={(password) => this.setState({password})}
            value={password}
            secureTextEntry={true}
            inputContainerStyle={styles.input}
          />

          <Button
            title="Log in"
            onPress={(e) => this._onPressButton(e)}
          />
        </View>

      </View>
    );
  }
}

const selector = (state) => {
  const { session } = state;
  return { session };
};

export default connect(selector)(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10
  }
});
