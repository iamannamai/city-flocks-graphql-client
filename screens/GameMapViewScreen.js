import React, { Component } from 'react';
import { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { getGameTasks } from '../store/game';

class GameMapView extends Component {
	componentDidMount() {
		if (this.props.event.id) {
			this.props.getTasks(this.props.event.id);
		}
		//this.props.getTasks(1);
	}

	render() {
		console.log('inside render', this.props);
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
							allTasks.map((task) => (
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

const mapStateToProps = (state) => {
	return {
		allTasks: state.game.tasks,
		event: state.event.allEvents.filter((event) => event.id === state.event.selectedEventId)[0]
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getTasks: (eventId) => dispatch(getGameTasks(eventId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMapView);
