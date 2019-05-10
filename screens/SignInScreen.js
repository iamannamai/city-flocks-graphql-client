import React from 'react';
import { connect } from 'react-redux';

import { Container, Content, Tab, Tabs, Toast } from 'native-base';
import { AsyncStorage, Image, StyleSheet } from 'react-native';

import { auth } from '../store/user';
import AuthForm from '../components/AuthForm';
import DismissKeyboard from '../components/DismissKeyboard';
import layout from '../constants/Layout';

class SignInScreen extends React.Component {
  state = {
    isLoggingIn: false
  };

  static navigationOptions = {
    title: 'Please sign in'
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      const { user } = this.props;
      if (user.username) {
        this.props.navigation.navigate('Main');
      } else if (user.error) {
        Toast.show({
          text: 'Invalid username or password',
          buttonText: 'Okay'
        });
      }
      this.setState({ isLoggingIn: false });
    }
  }

  _loginAsync = credentials => {
    this.props.login(credentials);
    this.setState({ isLoggingIn: true });
  };

  _registerAsync = credentials => {
    this.props.signup(credentials);
    this.setState({ isLoggingIn: true });
  };

  render() {
    return (
      <DismissKeyboard>
        {/* <KeyboardAvoidingView behavior="position" enabled> */}
        <Container style={styles.container}>
          <Content contentContainerStyle={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/splash.png')}
              style={styles.welcomeImage}
            />
            <Tabs>
              <Tab heading="Login">
                <AuthForm
                  buttonText="Login"
                  handleSubmit={this._loginAsync}
                  isLoggingIn={this.state.isLoggingIn}
                />
              </Tab>
              <Tab heading="Signup">
                <AuthForm
                  buttonText="Signup"
                  handleSubmit={this._registerAsync}
                  isLoggingIn={this.state.isLoggingIn}
                />
              </Tab>
            </Tabs>
          </Content>
        </Container>
        {/* </KeyboardAvoidingView> */}
      </DismissKeyboard>
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
    login(credentials) {
      dispatch(auth(credentials, 'login'));
    },
    signup(credentials) {
      dispatch(auth(credentials, 'signup'));
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
    alignItems: 'center'
  },
  welcomeContainer: {
    marginTop: layout.window.height * 0.1,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  welcomeImage: {
    width: layout.window.width * 0.9,
    // resizeMode: 'contain',
    marginBottom: 10,
    marginHorizontal: 'auto'
  }
});
