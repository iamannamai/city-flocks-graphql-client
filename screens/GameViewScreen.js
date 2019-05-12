import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { Alert } from 'react-native';
import { Container, Button, Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import { getTeamTasksThunk, getGameTasksThunk, endGameThunk } from '../store';
import { GEOFENCE_TASKNAME } from '../taskManager';
import BottomDrawer from '../components/BottomDrawer';
import TaskList from '../components/TaskList';

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
    if (status === 'granted') {
      this.setState({ hasLocationPermission: true });
    }
  }

  componentDidUpdate() {
    if (this.props.allTasks.length > 0 && this.state.geofencesSet === false) {
      Location.startGeofencingAsync(
        GEOFENCE_TASKNAME,
        this.props.allTasks.map(({id, latitude, longitude}) => {
          return {
            identifier: id.toString(),
            latitude,
            longitude,
            radius: 30,  // in meters, increase this for a real event?
          };
        })
      );

      this.setState({geofencesSet: true});
    }
    console.log("Tasks remaining, ", this.props.tasksRemaining);
    if (!this.props.tasksRemaining && this.state.geofencesSet) {
      console.log(this.props.tasksRemaining);
      this.setState({ gameOver: true });
    }
  }

  componentWillUnmount() {
    Location.stopGeofencingAsync(GEOFENCE_TASKNAME);
  }

  render() {
    let { navigate } = this.props.navigation;
    let { event, allTasks } = this.props;
    return (
      <Container>
        {/* <Button
          rounded
          onPress={() => navigate('Main')}
          style={{left: 30, top: 50}}
          >
          <Icon type="FontAwesome" name="user" style={{left: 30, top: 50}} />
        </Button> */}
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
                onPress: this._completeGame,
                style: 'cancel',
              }],
              { cancelable: true }
            )
        }

        <BottomDrawer>
          <TaskList event={event} tasks={allTasks} />
        </BottomDrawer>
      </Container>
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
    event: state.event.allEvents.filter(
      event => event.id === state.event.selectedEventId
    )[0],
    eventTeamId: state.game.eventTeamId,
    eventId: state.game.eventId,
    tasksRemaining: state.game.teamTasksRemaining
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
