import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { Alert } from 'react-native';
import { Container, Button, Icon, Toast } from 'native-base';
import { connect } from 'react-redux';

import {
  getTeamTasksThunk,
  getGameTasksThunk,
  endGameThunk,
  completeTaskThunk,
  setTaskComplete
} from '../store';
import { GEOFENCE_TASKNAME } from '../taskManager';
import BottomDrawer from '../components/BottomDrawer';
import TaskList from '../components/TaskList';
import ClueCollection from '../components/ClueCollection';
import Countdown from '../components/Countdown';
import socket, {
  BROADCAST_JOINED_GAME,
  JOINED_GAME,
  CONFIRM_TEAM_PRESENCE,
  COMPLETE_TASK
} from '../socket';

class GameMapView extends Component {
  state = {
    geofencesSet: false,
    hasLocationPermission: false,
    gameOver: false
  };

  async componentDidMount() {
    if (this.props.eventTeamId) {
      this.props.getGameTasks(this.props.eventId);
      this.props.getTeamTasks(this.props.eventTeamId);
    }

    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    const hasLocationPermission = status === 'granted';

    if (hasLocationPermission) {
      socket.emit(BROADCAST_JOINED_GAME, {
        eventTeamId: this.props.eventTeamId,
        username: this.props.user.username
      });
      socket.on(JOINED_GAME, username => {
        Toast.show({
          text: `${username} has joined`,
          duration: 2000
        });
      });

      socket.on(
        CONFIRM_TEAM_PRESENCE,
        ({ isTeamPresent, missingPlayerCount, taskId }) => {
          console.log('All your team is here: ', isTeamPresent);
          this._showTaskCompleteAlert(isTeamPresent, taskId);
        }
      );

      socket.on(COMPLETE_TASK, taskId => {
        this.props.setTaskComplete(taskId);
      });
    }

    this.setState({
      hasLocationPermission
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.allTasks.length > 0 && this.state.geofencesSet === false) {
      this._createGeofences();
      this.setState({ geofencesSet: true });
    }

    if (
      prevProps.tasksRemaining > 0 &&
      this.props.tasksRemaining === 0 &&
      this.state.geofencesSet
    ) {
      this.setState({ gameOver: true });
    }
  }

  componentWillUnmount() {
    // stop geofencing if unmounting before game ends
    Location.hasStartedGeofencingAsync(GEOFENCE_TASKNAME).then(
      bool => bool && Location.stopGeofencingAsync(GEOFENCE_TASKNAME)
    );
    socket.removeListener(BROADCAST_JOINED_GAME);
    socket.removeListener(CONFIRM_TEAM_PRESENCE);
  }

  render() {
    let { navigate } = this.props.navigation;
    let { event, allTasks, teamTasks } = this.props;
    return (
      <Container style={{ zIndex: 2 }}>
        <Countdown
          endTime={this.props.endTime}
          handleExpire={this._endGame}
          styling={{
            fontSize: 30,
            flex: -1,
            flexShrink: 10,
            left: 230,
            top: 50,
            zIndex: 1
          }}
        />

        <Button
          rounded
          onPress={() => navigate('Main')}
          style={{ left: 30, top: 50, zIndex: 1 }}
        >
          <Icon type="FontAwesome" name="user" />
        </Button>
        {event && (
          <MapView
            showsUserLocation={this.state.hasLocationPermission}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: event.latitude,
              longitude: event.longitude,
              latitudeDelta: event.latitudeDelta,
              longitudeDelta: event.longitudeDelta
            }}
          >
            {allTasks &&
              allTasks.map(task => (
                <MapView.Marker
                  key={task.id}
                  coordinate={{
                    latitude: task.latitude,
                    longitude: task.longitude
                  }}
                  description={`${task.name}-${task.description}`}
                />
              ))}
          </MapView>
        )}

        {this.state.gameOver &&
          // some kind of alert or modal to navigate back to main screen
          Alert.alert(
            `Event Complete!`,
            `You've completed all tasks in X time`,
            [
              {
                text: 'End Game',
                onPress: this._endGame,
                style: 'cancel'
              }
            ],
            { cancelable: true }
          )}

        <BottomDrawer>
          <TaskList event={event} teamTasks={teamTasks} />
          <ClueCollection clues={[]} />
        </BottomDrawer>
      </Container>
    );
  }

  _createGeofences = () => {
    Location.startGeofencingAsync(
      GEOFENCE_TASKNAME,
      this.props.allTasks.map(({ id, latitude, longitude }) => {
        return {
          identifier: id.toString(),
          latitude,
          longitude,
          radius: 15 // in meters, increase this for a real event?
        };
      })
    );
  };

  _showTaskCompleteAlert = (isTeamPresent, taskId) => {
    console.log(this.props.allTasks.filter(task => task.id === Number(taskId)));
    isTeamPresent
      ? Alert.alert(
          `You found a clue!`,
          `You've made it to ${
            this.props.allTasks.filter(task => task.id === Number(taskId))[0]
              .name
          } and collected the following clues: ${`ABC`}`,
          [
            {
              text: 'Complete Task',
              onPress: () =>
                this.props.completeTask(this.props.eventTeamId, taskId),
              style: 'cancel'
            },
            {
              text: 'Dismiss',
              style: 'cancel'
            }
          ],
          { cancelable: true }
        )
      : Alert.alert(
          `You've found something!`,
          `Waiting for the test of your team to arrive to reveal your clue`,
          [
            {
              text: 'Dismiss',
              style: 'cancel'
            }
          ],
          { cancelable: true }
        );
  };

  _endGame = () => {
    Location.stopGeofencingAsync(GEOFENCE_TASKNAME);
    this.props.endGame(this.props.eventTeamId);
    this.props.navigation.navigate('Main');
  };
}

const mapStateToProps = state => {
  return {
    allTasks: state.game.tasks,
    teamTasks: state.game.teamTasks,
    event: state.event.allEvents.filter(
      event => event.id === state.game.eventId
    )[0],
    eventTeamId: state.game.eventTeamId,
    eventId: state.game.eventId,
    tasksRemaining: state.game.teamTasksRemaining,
    user: state.user,
    endTime: state.game.endTime || state.event.activeEvent.endTime
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeamTasks: eventTeamId => dispatch(getTeamTasksThunk(eventTeamId)),
    getGameTasks: eventId => dispatch(getGameTasksThunk(eventId)),
    endGame: eventTeamId => dispatch(endGameThunk(eventTeamId)),
    completeTask: (eventTeamId, taskId) =>
      dispatch(completeTaskThunk(eventTeamId, taskId)),
    // update store on a COMPLETE_TASK event
    setTaskComplete: taskId => dispatch(setTaskComplete(taskId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameMapView);
