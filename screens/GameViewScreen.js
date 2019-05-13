import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { Alert,View } from 'react-native';
import { Container, Button, Text, Icon } from 'native-base';
import { connect } from 'react-redux';

import { getTeamTasksThunk, getGameTasksThunk, endGameThunk } from '../store';
import { GEOFENCE_TASKNAME } from '../taskManager';
import BottomDrawer from '../components/BottomDrawer';
import TaskList from '../components/TaskList';
import Countdown from '../components/Countdown';

class GameMapView extends Component {
  state = {
    geofencesSet: false,
    hasLocationPermission: false,
    gameOver: false
  }

  async componentDidMount() {
    if (this.props.eventTeamId) {
      this.props.getGameTasks(this.props.eventId);
      this.props.getTeamTasks(this.props.eventTeamId);
    }

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const hasLocationPermission = status === 'granted';

    this.setState({
      hasLocationPermission
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.allTasks.length > 0 && this.state.geofencesSet === false) {
      this._createGeofences();
      this.setState({ geofencesSet: true });
    }

    if (prevProps.tasksRemaining > 0 && this.props.tasksRemaining === 0 && this.state.geofencesSet) {
      this.setState({ gameOver: true });
    }
  }

  componentWillUnmount() {
    // stop geofencing if unmounting before game ends
    Location.hasStartedGeofencingAsync(GEOFENCE_TASKNAME)
      .then(bool => bool && Location.stopGeofencingAsync(GEOFENCE_TASKNAME));
  }

  render() {
    let { navigate } = this.props.navigation;
	let { event, allTasks, teamTasks } = this.props;
    return (
      <Container style={{zIndex: 2}}>

        <Countdown endTime={this.props.endTime} handleExpire={this._endGame} />

        <Button
          rounded
          onPress={() => navigate('Main')}
          style={{left: 30, top: 50, zIndex: 1}}
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

        {
          this.state.gameOver &&
            // some kind of alert or modal to navigate back to main screen
            Alert.alert(
              `Event Complete!`,
              `You've completed all tasks in X time`,
              [{
                text: 'End Game',
                onPress: this._endGame,
                style: 'cancel',
              }],
              { cancelable: true }
            )
        }

        <BottomDrawer>
          <TaskList event={event} teamTasks={teamTasks} />
        </BottomDrawer>
      </Container>
    );
  }

  _createGeofences = () => {
    Location.startGeofencingAsync(
      GEOFENCE_TASKNAME,
      this.props.allTasks.map(({id, latitude, longitude}) => {
        return {
          identifier: id.toString(),
          latitude,
          longitude,
          radius: 20,  // in meters, increase this for a real event?
        };
      })
    );
  }

  _endGame = () => {
    Location.stopGeofencingAsync(GEOFENCE_TASKNAME);
    this.props.endGame(this.props.eventTeamId);
    this.props.navigation.navigate('Main');
  }
}

const mapStateToProps = state => {
  return {
	allTasks: state.game.tasks,
	teamTasks: state.game.teamTasks,
    event: state.event.allEvents.filter(
      event => event.id === state.event.selectedEventId
    )[0],
    eventTeamId: state.game.eventTeamId,
    eventId: state.game.eventId,
    tasksRemaining: state.game.teamTasksRemaining,
    endTime: state.game.endTime || state.event.activeEvent.endTime
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeamTasks: eventTeamId => dispatch(getTeamTasksThunk(eventTeamId)),
    getGameTasks: eventId => dispatch(getGameTasksThunk(eventId)),
    endGame: eventTeamId => dispatch(endGameThunk(eventTeamId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameMapView);
