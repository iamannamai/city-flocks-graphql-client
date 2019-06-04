import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Permissions } from 'expo';

import { Alert } from 'react-native';
import {
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
  setActiveEvent,
  leaveTeamThunk,
  getTeamDataThunk
} from '../store';
import { ActiveEventCard, ManageTeamCard, SingleEventModal, UserMainCard, UserEventsCard } from '../components';

class UserScreen extends Component {
  state = {
    isModalVisible: false,
    showTimer: true
  };

  async componentDidMount() {
		const { teamId } = this.props.user;
		this.props.getEvents();

    // Attempt to reconcile location permissions
    await Permissions.askAsync(Permissions.LOCATION);
    if (teamId) {
			this.props.setTeam(teamId);
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
          onDismiss: () =>
            this.props.setActiveEvent(
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
    let { activeEvent, allEvents, myEventIds, team, user } = this.props;
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
          <UserMainCard
						user={user}
						team={team}
						handleSignout={this._signOutAsync}
					/>
					{activeEvent.id
						&& this.state.showTimer
						&& <ActiveEventCard
								endTime={activeEvent.endTime}
								handleEndGame={this._endGame}
								handleResumeGame={this._resumeGame}
							/>
					}
					<UserEventsCard
						events={events}
						handleShowModal={this._showModal}
						navigate={navigate}
					/>
					<ManageTeamCard
						team={team}
						handleLeaveTeam={this._leaveTeam}
						navigate={navigate}
					/>
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
    if (this.props.activeEvent.id) {
      Toast.show({
        text: `You're already in a game! You can't start another game!`,
        type: 'warning',
        duration: 2000
			});
		} else {
      this.props.startGame(eventTeam.id, this.props.user.username);
      if (this.props.eventTeamId) this._openMap();
    }
  };

  _resumeGame = () => {
    const { activeEvent } = this.props;
    this.props.setSelectedEvent(activeEvent.eventId);
    this.props.resumeGame(activeEvent.id);
    this.setState({ showTimer: false });
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

  _leaveTeam = () => {
    let { id } = this.props.user;
    //console.log('leaving team');
    this.props.leaveTeam(id);
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
    activeEvent: state.event.myActiveEvent || {},
    team: state.team
  };
};

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout()),
    getEvents: () => dispatch(getEventsThunk()),
    getMyEvents: teamId => dispatch(getMyEventsThunk(teamId)),
    setSelectedEvent: id => dispatch(setSelectedEvent(id)),
    startGame: (eventTeamId, username) =>
      dispatch(startGameThunk(eventTeamId, username)),
    setGameEvent: game => dispatch(setGameEvent(game)),
    resumeGame: eventTeamId => dispatch(resumeGameThunk(eventTeamId)),
    endGame: eventTeamId => dispatch(endGameThunk(eventTeamId)),
    setActiveEvent: event => dispatch(setActiveEvent(event)),
    leaveTeam: userId => dispatch(leaveTeamThunk(userId)),
    setTeam: teamId => dispatch(getTeamDataThunk(teamId))
  };
};

export default connect(
  mapState,
  mapDispatch
)(UserScreen);
