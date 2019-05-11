import React, { Component } from 'react';
import { MapView } from 'expo';
import { Container, Button, Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import { getTeamTasksThunk, getGameTasksThunk } from '../store';
import BottomDrawer from '../components/BottomDrawer';
import TaskList from '../components/TaskList';

class GameMapView extends Component {
  componentDidMount() {
    if (this.props.eventTeamId) {
      this.props.getGameTasks(this.props.eventId);
      this.props.getTeamTasks(this.props.eventTeamId);
    }
  }

  render() {
    let { navigate } = this.props.navigation;
    let { event, allTasks } = this.props;
    return (
      <Container>
        {event && (
          <MapView
            showsUserLocation={true}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: event.latitude,
              longitude: event.longitude,
              latitudeDelta: event.latitudeDelta,
              longitudeDelta: event.longitudeDelta
            }}
          >
            <Button
                rounded
                onPress={() => navigate('Main')}
                style={{left: 30, top: 50}}
                >
                <Icon type="FontAwesome" name="user" style={{left: 30, top: 50}} />
            </Button>

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
