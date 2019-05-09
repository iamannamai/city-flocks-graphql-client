import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TouchableOpacity } from 'react-native';
import {
  Button,
  Card,
  CardItem,
  Text,
  Icon,
  H2,
  H3,
  List,
  Thumbnail,
  Left,
  Right,
  Content
} from 'native-base';

import { logout } from '../store';
const avatar = require('../assets/images/avataaars.png');

import { getEventsThunk } from '../store/event';
import EventsListItem from '../components/EventsListItem';

class UserScreen extends Component {
  _signOutAsync = async () => {
    await this.props.logout();
    this.props.navigation.navigate('Auth');
  }

  componentDidMount() {
    this.props.getEvents();
  }

  render() {
	let { allEvents } = this.props.events;
	let { username } = this.props.user;
	if (username) {
		username = username[0].toUpperCase() + username.slice(1);
	}

    return (
      <Content>
        <Card>
          <CardItem style={{
            flexDirection: 'column'
          }}>
            <Thumbnail source={avatar} />
            <H2>{`Welcome Back ${username}!`}</H2>
            <Text>Almond Lima</Text>
          </CardItem>
          <CardItem style={{ justifyContent: 'center' }}>
            <Button onPress={this._signOutAsync}>
              <Text>Sign out</Text>
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
                {allEvents && allEvents.map(event => (<EventsListItem key={event.id} event={event} />))}
              </List>
            </Content>
          </CardItem>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Events")}>
          <CardItem thumbnail>
              <Left>
                <Icon type='Entypo' name='open-book' />
                <Text>View More!!!</Text>
              </Left>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </CardItem>
            </TouchableOpacity>
        </Card>
        <Content>
          <Card>
            <CardItem header bordered>
              <Text>Team</Text>
            </CardItem>
            <CardItem >
              <H3>Almond-Lima</H3>
            </CardItem>
            <CardItem>
              <Left>
                <Icon type='FontAwesome' name='sign-out' />
                <Text>Leave Team!!!</Text>
              </Left>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Icon type='FontAwesome' name='group' />
                <Text>View Team-Mates!!!</Text>
              </Left>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Content>
    );
  }
}

const mapState = state => {
  return {
	user: state.user,
	events: state.event
  };
};

const mapDispatch = dispatch => {
  return {
	logout: () => dispatch(logout()),
	getEvents: () => dispatch(getEventsThunk())
  };
};

export default connect(mapState, mapDispatch)(UserScreen);
