import React, { Component } from 'react';
import { MapView } from 'expo';
import { Container, Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { getGameTasks } from '../store/game';
import BottomDrawer from '../components/BottomDrawer';
import TaskList from '../components/TaskList';

class GameMapView extends Component {
	componentDidMount() {
		if (this.props.event.id) {
			this.props.getTasks(this.props.event.id);
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
						}}>

						<Button
							rounded
							onPress={() => navigate('Main')}
							style={{left: 30, top: 50}}
							>
							<Icon type="FontAwesome" name="user" style={{left: 30, top: 50}} />
						</Button>

						{allTasks &&
							allTasks.map((task) => (
								<MapView.Marker
									key={task.id}
									coordinate={{
										latitude: task.latitude,
										longitude: task.longitude
									}}
									title={task.name}
									description={task.description}
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
