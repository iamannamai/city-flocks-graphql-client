import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Container,
  Button,
  Card,
  CardItem,
  Body,
  Text,
  Icon,
  H2,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Content
} from 'native-base';

import { logout } from '../store';
const logo = require('../assets/images/avataaars.png')

class UserScreen extends Component {
  _signOutAsync = async () => {
    await this.props.logout();
    this.props.navigation.navigate('Auth');
  }

  render() {
    return (
      <Container>


        <Card>
          <CardItem style={{
            flexDirection: 'column'
          }}>
            <Icon name='person' />
            <H2>{`Welcome Back ${this.props.user.username}`}</H2>
            <Text>Testing</Text>

          </CardItem>
          <CardItem style={{ justifyContent: 'center' }}>
            <Button onPress={this._signOutAsync}>
              <Text>Sign me out :</Text>
            </Button>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>

            <Text>Events</Text>
          </CardItem>
          <CardItem >
            <Content>
              <List>
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail square source={logo} />
                  </Left>
                  <Body style={{ flex: 1 }}>
                    <Text>New PLace</Text>
                    <Text note numberOfLines={1}> Why So Serious!!!!!!</Text>
                  </Body>
                  <Right>
                    <Button transparent>
                      <Text>View</Text>
                    </Button>
                  </Right>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail square source={logo} />
                  </Left>
                  <Body style={{ flex: 1 }}>
                    <Text>New PLace</Text>
                    <Text note numberOfLines={1}> Why So Serious!!!!!!</Text>
                  </Body>
                  <Right>
                    <Button transparent>
                      <Text>View</Text>
                    </Button>
                  </Right>
                </ListItem>
              </List>
            </Content>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <Text>Testing</Text>
          </CardItem>
          <CardItem >

            {/* <Text>{`Welcome Back ${this.props.user.username}`}</Text> */}
            <Text>Team</Text>
          </CardItem>
        </Card>

      </Container>
    );
  }
}

const mapState = state => {
  return {
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default connect(mapState, mapDispatch)(UserScreen);
