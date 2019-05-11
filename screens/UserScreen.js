import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TouchableOpacity } from 'react-native';
import {
  Body,
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
  ListItem,
	Right,
	Content,
	Container
} from 'native-base';

import { logout, getEventsThunk, getMyEventsThunk, setSelectedEvent, startGameThunk } from '../store';
import EventsListItem from '../components/EventsListItem';
import SingleEventModal from '../components/SingleEventModal';

const avatar = require('../assets/images/avataaars.png');

class UserScreen extends Component {
	state = {
		isModalVisible: false
	};

  componentDidMount() {
    this.props.getEvents();
    if (this.props.user.teamId) {
      this.props.getMyEvents(this.props.user.teamId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.eventTeamId && prevProps.eventTeamId !== this.props.eventTeamId) {
      this._openMap();
    }
  }

  render() {
    let { allEvents, myEventIds } = this.props;
    let { username } = this.props.user;
    let { navigate } = this.props.navigation;
    if (username) {
      username = username[0].toUpperCase() + username.slice(1);
    }

    const events = allEvents.filter(event => myEventIds.includes(event.id));

    return (
      <Container>
        <Content>
          {this.state.isModalVisible && (
            <SingleEventModal
              isModalVisible={this.state.isModalVisible}
              hideModal={this._hideModal}
              handleOnPress={this._startGame}
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
                  {events
                    ? events.map(event => (
                      <EventsListItem
                        key={event.id}
                        event={event}
                        handleOnPress={this._showModal}
                        />
                    ))
                    : (
                      <ListItem>
                        <Body>
                          <Text note>Your team is not signed up for any events</Text>
                        </Body>
                      </ListItem>
                    )
                  }
                </List>
              </Content>
            </CardItem>
            <TouchableOpacity onPress={() => navigate('Events')}>
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
                  <Text onPress={() => navigate('Teams')}>View Team-Mates!!!</Text>
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

	_showModal = (eventId) => {
		this.props.setSelectedEvent(eventId);
		this.setState({ isModalVisible: true });
	};

	_hideModal = () => {
		this.setState({ isModalVisible: false });
  };

  _startGame = () => {
    const eventTeamId = this.props.myEvents
      .filter(event => event.eventId === this.props.selectedEventId)[0]
      .id;
    this.props.startGame(eventTeamId);
    if (this.props.eventTeamId) this._openMap();
  }

  _openMap = () => {
    this.props.navigation.navigate('Game');
  }
}

const mapState = state => {
  return {
    user: state.user,
    allEvents: state.event.allEvents,
    myEvents: state.event.myEvents,
    myEventIds: state.event.myEventIds,
    selectedEventId: state.event.selectedEventId,
    eventTeamId: state.game.eventTeamId
  };
};

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout()),
    getEvents: () => dispatch(getEventsThunk()),
    getMyEvents: teamId => dispatch(getMyEventsThunk(teamId)),
    setSelectedEvent: id => dispatch(setSelectedEvent(id)),
    startGame: eventTeamId => dispatch(startGameThunk(eventTeamId))
  };
};

export default connect(mapState, mapDispatch)(UserScreen);
