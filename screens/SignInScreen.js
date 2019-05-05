import React from 'react';
import { connect } from 'react-redux';

import { Form,Input,Item } from 'native-base';
import {
  AsyncStorage,
  Button,
  Image,
  StyleSheet,
  View,
} from 'react-native';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Please sign in"
  };

  _signInAsync = async () => {
    await AsyncStorage.setItem("userToken", "abc");
    this.props.navigation.navigate("Main");
  };

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require("../assets/images/robot-dev.png")
                  : require("../assets/images/robot-prod.png")
              }
              style={styles.welcomeImage}
            />
          </View>
          <View>
          <Form>
            <Item>
              <Input placeholder="Username" textContentType="username" />
            </Item>
            <Item last>
              <Input placeholder="Password" secureTextEntry={true} textContentType="password" />
            </Item>
            <Button title="Sign in!" onPress={this._signInAsync} />
            <Button title="Create an account!" onPress={this._signInAsync} />
          </Form>
          </View>
      </View>
    );
  }
}

const mapDispatch = dispatch => {
    return {
      handleSubmit(evt) {
        evt.preventDefault()
        const formName = evt.target.name
        const email = evt.target.email.value;
        const password = evt.target.password.value
        dispatch(auth(email, password, formName));
      }
    }
}

export default connect(null,mapDispatch)(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  }
});