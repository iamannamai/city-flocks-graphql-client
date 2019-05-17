import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Permissions } from 'expo';

import { Alert, TouchableOpacity } from 'react-native';
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
  Container,
  Toast
} from 'native-base';

import socket, { JOIN_TEAM_ROOM, GAME_START } from '../socket';
import {
  logout,
  getEventsThunk,
  getMyEventsThunk,
  setSelectedEvent,
  startGameThunk,
  resumeGameThunk,
  endGameThunk,
  setGameEvent,
  setActiveEvent
} from '../store';
import EventsListItem from '../components/EventsListItem';
import SingleEventModal from '../components/SingleEventModal';
import Countdown from '../components/Countdown';
import { avataaars } from '../assets/images/avataaars';

class UserScreen extends Component {
  state = {
    isModalVisible: false,
    showTimer: true
  };

  async componentDidMount() {
    const { teamId } = this.props.user;
    // Attempt to reconcile location permissions
    await Permissions.askAsync(Permissions.LOCATION);
    this.props.getEvents();
    if (teamId) {
      this.props.getMyEvents(teamId);
      socket.emit(JOIN_TEAM_ROOM, teamId);
    }
    socket.on(GAME_START, game => {
      Alert.alert(
        'Game Start',
        `A teammate has started the event ${game.name}`,
        [
          {
            text: 'See Map',
            onPress: () => this.props.setGameEvent(game),
            style: 'cancel'
          },
          {
            text: 'Dismiss',
            onPress: () =>
              this.props.setActiveEvent(
                this.props.myEvents.find(event => event.id === game.id)
              ),
            style: 'cancel'
          }
        ],
        {
          cancelable: true,
          onDismiss: () => this.props.setActiveEvent(
            this.props.myEvents.find(event => event.id === game.eventId)
          )
        }
      );
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.eventTeamId &&
      prevProps.eventTeamId !== this.props.eventTeamId
    ) {
      this._openMap();
    }
  }

  componentWillUnmount() {
    socket.removeListener(GAME_START);
  }

  render() {
    let { allEvents, myEventIds } = this.props;
    let { username, team } = this.props.user;
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
          <Card style={{paddingTop: 32}}>
            <CardItem
              style={{
                flexDirection: 'column'
              }}
            >
                <Thumbnail
                  source={avataaars[this.props.user.id]}
                  style={{width: 200, height: 200}} />
              <H2>{`Welcome Back ${username}!`}</H2>
              <Text>{team && team.name}</Text>
            </CardItem>
            <CardItem style={{ justifyContent: 'center' }}>
              <Button onPress={this._signOutAsync}>
                <Text>Sign out</Text>
              </Button>
            </CardItem>
          </Card>

          {this.props.activeEvent.id && this.state.showTimer && (
            <Card>
              <CardItem style={{backgroundColor: '#4dad4a'}}>
                <Left>
                  <Countdown
                    endTime={this.props.activeEvent.endTime}
                    handleExpire={this._endGame}
                    styling={{ fontSize: 10, flex: 0, justifyContent: "center", alignItems: "center" }}
                  />
                  <Text>Your team has an active event!</Text>
                </Left>
                <Right>
                  <Button success outline onPress={this._resumeGame} thumbnail>
                    <Text>Resume</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          )}

          <Card>
            <CardItem header bordered>
              <Text>Events</Text>
            </CardItem>
            <CardItem>
              <Content>
                <List>
                  {events.length > 0 ? (
                    events.map(event => (
                      <EventsListItem
                        key={event.id}
                        event={event}
                        handleOnPress={this._showModal}
                      />
                    ))
                  ) : (
                    <ListItem>
                      <Body>
                        <Text note>
                          Your team is not signed up for any events
                        </Text>
                      </Body>
                    </ListItem>
                  )}
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
                <H3>{team && team.name}</H3>
              </CardItem>
              <CardItem>
                <Left>
                  <Icon type="FontAwesome" name="group" />
                  <Text onPress={() => navigate('Teams')}>
                    Manage teammates
                  </Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Icon type="FontAwesome" name="sign-out" />
                  <Text>Leave Team</Text>
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

  _startGame = () => {
    const eventTeam = this.props.myEvents.filter(
      event => event.eventId === this.props.selectedEventId
    )[0];
    if (this.props.activeEvent.id)
      Toast.show({
        text: `You're already in a game! You can't start another game!`,
        type: 'warning',
        duration: 2000
      });
    else {
      this.props.startGame(eventTeam.id, this.props.user.username);
      if (this.props.eventTeamId) this._openMap();
    }
  };

  _resumeGame = () => {
    const { activeEvent } = this.props;
    this.props.setSelectedEvent(activeEvent.eventId);
    this.props.resumeGame(activeEvent.id);
    this.setState({showTimer: false})
    if (this.props.eventTeamId) this._openMap();
  };

  _endGame = () => {
    const { activeEvent } = this.props;
    this.props.endGame(activeEvent.id);
    Toast.show({
      text: `Your current event has ended`,
      type: 'success',
      duration: 2000
    });
  };

  _openMap = () => {
    this.props.navigation.navigate('Game');
  };
}

const mapState = state => {
  return {
    user: state.user,
    allEvents: state.event.allEvents,
    myEvents: state.event.myEvents,
    myEventIds: state.event.myEventIds,
    selectedEventId: state.event.selectedEventId,
    eventTeamId: state.game.eventTeamId,
    activeEvent: state.event.myActiveEvent || {}
  };
};

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout()),
    getEvents: () => dispatch(getEventsThunk()),
    getMyEvents: teamId => dispatch(getMyEventsThunk(teamId)),
    setSelectedEvent: id => dispatch(setSelectedEvent(id)),
    startGame: (eventTeamId, username) => dispatch(startGameThunk(eventTeamId, username)),
    setGameEvent: game => dispatch(setGameEvent(game)),
    resumeGame: eventTeamId => dispatch(resumeGameThunk(eventTeamId)),
    endGame: eventTeamId => dispatch(endGameThunk(eventTeamId)),
    setActiveEvent: event => dispatch(setActiveEvent(event))
  };
};

export default connect(
  mapState,
  mapDispatch
)(UserScreen);
