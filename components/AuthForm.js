import React from 'react';

import { Button, Form, Input, Item, Spinner, Text } from 'native-base';


class AuthForm extends React.Component {
  state = {
    username: '',
    email: '',
    password: ''
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Form>
        <Item>
          <Input
            placeholder="Username"
            textContentType="username"
            onChangeText={text => this.handleChange('username', text.toLowerCase())}
          />
        </Item>
        {
          this.props.buttonText === 'Signup' &&
          <Item>
            <Input
              placeholder="Email"
              textContentType="emailAddress"
              onChangeText={text => this.handleChange('email', text)}
            />
          </Item>
        }
        <Item last>
          <Input
            placeholder="Password"
            secureTextEntry={true}
            textContentType="password"
            onChangeText={text => this.handleChange('password', text)}
          />
        </Item>
        <Button block disabled={this.props.isLoggingIn} onPress={() => this.props.handleSubmit(this.state)}>
            <Text>{this.props.buttonText}</Text>
            {this.props.isLoggingIn && <Spinner />}
        </Button>
      </Form>
    );
  }
}

export default AuthForm;
