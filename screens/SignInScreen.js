import React from 'react';
import { connect } from 'react-redux';

import { Form, Input, Item, Toast } from 'native-base';
import { Button, Image, Keyboard, StyleSheet, View } from 'react-native';

import { auth } from '../store/user';

class SignInScreen extends React.Component {
  state = {
    username: '',
    password: ''
  };

  static navigationOptions = {
    title: 'Please sign in'
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user.username) {
        this.props.navigation.navigate('Main');
      } else if (this.props.user.error) {
        Keyboard.dismiss();
        Toast.show({ text: 'Invalid username or password', buttonText: 'Okay' });
      }
    }
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  _signInAsync = () => {
    this.props.handleSubmit(this.state.username, this.state.password);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/splash.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View>
          <Form>
            <Item>
              <Input
                placeholder="Username"
                textContentType="username"
                onChangeText={text =>
                  this.handleChange('username', text.toLowerCase())
                }
              />
            </Item>
            <Item last>
              <Input
                placeholder="Password"
                secureTextEntry={true}
                textContentType="password"
                onChangeText={text => this.handleChange('password', text)}
              />
            </Item>
            <Button title="Sign in!" onPress={this._signInAsync} />
            <Button title="Create an account!" onPress={this._signInAsync} />
          </Form>
        </View>
      </View>
    );
  }
}

const mapLogin = state => {
  return {
    user: state.user,
    error: state.user.error
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(username, password) {
      dispatch(auth(username, password, 'login'));
    }
  };
};

export default connect(
  mapLogin,
  mapDispatch
)(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  }
});
