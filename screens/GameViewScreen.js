import React, { Component } from 'react';
import { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { getTasksThunk } from '../store';

class GameMapView extends Component {
  componentDidMount() {
    if (this.props.eventTeamId) {
      this.props.getTasks(this.props.eventTeamId);
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

        <Button onPress={() => navigate('Main')}>
          <Text>Go back</Text>
        </Button>
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
    eventTeamId: state.game.eventTeamId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTasks: eventTeamId => dispatch(getTasksThunk(eventTeamId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameMapView);
