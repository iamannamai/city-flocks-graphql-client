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
  Content,
  Container
} from 'native-base';

import { logout } from '../store';
import { getEventsThunk, getMyEventsThunk, setSelectedEvent } from '../store/event';
import EventsListItem from '../components/EventsListItem';
import SingleEventModal from '../components/SingleEventModal';

const avatar = require('../assets/images/avataaars.png');

class UserScreen extends Component {
  state = {
    isModalVisible: false
  };

  componentDidMount() {
    this.props.getEvents();
    console.log('gettingEvents');
    if (this.props.user.teamId) {
      console.log('getting my events');
      this.props.getMyEvents(this.props.user.teamId);
    }
  }

  render() {
    let { allEvents, myEvents } = this.props;
    let { username } = this.props.user;
    if (username) {
      username = username[0].toUpperCase() + username.slice(1);
    }

    const events = allEvents.filter(event => myEvents.includes(event.id));

    return (
      <Container>
        <Content>
          {this.state.isModalVisible && (
            <SingleEventModal
              isModalVisible={this.state.isModalVisible}
              hideModal={this._hideModal}
            />
          )}
          <Card>
            <CardItem
              style={{
                flexDirection: 'column'
              }}
            >
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
            <CardItem>
              <Content>
                <List>
                  {events &&
                    events.map(event => (
                      <EventsListItem
                        key={event.id}
                        event={event}
                        handleOnPress={this._showModal}
                        />
                    ))}
                </List>
              </Content>
            </CardItem>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Events')}
            >
              <CardItem thumbnail>
                <Left>
                  <Icon type="Entypo" name="open-book" />
                  <Text>View More!!!</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </CardItem>
            </TouchableOpacity>
          </Card>
          <Content>
            <Card>
              <CardItem header bordered>
                <Text>Team</Text>
              </CardItem>
              <CardItem>
                <H3>Almond-Lima</H3>
              </CardItem>
              <CardItem>
                <Left>
                  <Icon type="FontAwesome" name="sign-out" />
                  <Text>Leave Team!!!</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Icon type="FontAwesome" name="group" />
                  <Text>View Team-Mates!!!</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </CardItem>
            </Card>
          </Content>
        </Content>
      </Container>
    );
  }

  _signOutAsync = async () => {
    await this.props.logout();
    this.props.navigation.navigate('Auth');
  };

  _showModal = eventId => {
    this.props.setSelectedEvent(eventId);
    this.setState({ isModalVisible: true });
  };

  _hideModal = () => {
    this.setState({ isModalVisible: false });
  };
}

const mapState = state => {
  return {
    user: state.user,
    allEvents: state.event.allEvents,
    myEvents: state.event.myEventIds
  };
};

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout()),
    getEvents: () => dispatch(getEventsThunk()),
    getMyEvents: teamId => dispatch(getMyEventsThunk(teamId)),
    setSelectedEvent: id => dispatch(setSelectedEvent(id))
  };
};

export default connect(
  mapState,
  mapDispatch
)(UserScreen);
