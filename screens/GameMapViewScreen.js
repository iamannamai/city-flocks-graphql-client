import React, { Component } from 'react';
import { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { getTaskThunk } from '../store/task';

const dummyDate = [
	{
		id: 1,
		name: 'Charging Bull',
		description: 'Grab the bull by the horns',
		lat: 40.7055648,
		long: -74.0156334,
		address: 'New York, NY 10004',
		points: 600,
		createdAt: '2019-05-09T16:09:25.158Z',
		updatedAt: '2019-05-09T16:09:25.225Z',
		eventId: 1
	},
	{
		id: 3,
		name: 'New York Stock Exchange',
		description: 'Stand upon the steps of big business',
		lat: 40.7054428,
		long: -74.013037,
		address: '11 Wall St, New York, NY 10005',
		points: 400,
		createdAt: '2019-05-09T16:09:25.158Z',
		updatedAt: '2019-05-09T16:09:25.237Z',
		eventId: 1
	},
	{
		id: 4,
		name: 'Burger King',
		description: 'The MOST IMPORTANT place to visit in FiDi',
		lat: 40.704475,
		long: -74.0122002,
		address: '16 Beaver St, New York, NY 10004',
		points: 5000,
		createdAt: '2019-05-09T16:09:25.159Z',
		updatedAt: '2019-05-09T16:09:25.243Z',
		eventId: 1
	}
];
class GameMapView extends Component {
	render() {
		let { navigate } = this.props.navigation;
		return (
			<Container>
				<MapView
					showsUserLocation={true}
					style={{ flex: 1 }}
					initialRegion={{
						latitude: 40.71,
						longitude: -74.008,
						latitudeDelta: 0.02,
						longitudeDelta: 0.009
					}}
				>
					{dummyDate.map((task) => (
						<MapView.Marker
							key={task.id}
							coordinate={{
								latitude: task.lat,
								longitude: task.long
							}}
							description={`${task.name}-${task.description}`}
						/>
					))}
				</MapView>

				<Button onPress={() => navigate('Main')}>
					<Text>Go back</Text>
				</Button>
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		allTasks: state.task.allTasks,
		event: state.event.allEvents.filter((event) => event.id === state.event.selectedEventId)[0]
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getTask: (eventId) => dispatch(getTaskThunk(eventId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMapView);
