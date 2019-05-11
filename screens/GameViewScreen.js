import React, { Component } from 'react';
import { MapView, Location, Permissions } from 'expo';
import { Container, Button, Text, Icon, Fab } from 'native-base';
import { connect } from 'react-redux';
import { getTeamTasksThunk, getGameTasksThunk } from '../store';
import BottomDrawer from '../components/BottomDrawer';
import TaskList from '../components/TaskList';

class GameMapView extends Component {
  state = {
    geofencesSet: false,
    hasLocationPermission: false
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

  async componentDidUpdate() {
    if (this.props.allTasks.length > 0 && this.state.geofencesSet === false) {
      Location.startGeofencingAsync(
        'geofence',
        this.props.allTasks.map(({id, latitude, longitude}) => {
          return {
            identifier: id.toString(),
            latitude,
            longitude,
            radius: 20,  // in meters, increase this for a real event?
          };
        })
      );

      this.setState({geofencesSet: true});
    }
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

        <BottomDrawer>
          <TaskList event={event} tasks={allTasks} />
        </BottomDrawer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    allTasks: state.game.tasks,
    event: state.event.allEvents.filter(
      event => event.id === state.event.selectedEventId
    )[0],
    eventTeamId: state.game.eventTeamId,
    eventId: state.game.eventId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeamTasks: eventTeamId => dispatch(getTeamTasksThunk(eventTeamId)),
    getGameTasks: eventId => dispatch(getGameTasksThunk(eventId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameMapView);
