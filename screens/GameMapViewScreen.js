import React, { Component } from 'react';
import { MapView } from 'expo';
import { Container, Button, Text } from 'native-base';
import { NavigationEvents } from 'react-navigation';

export default class GameMapView extends Component {
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
				/>
				<Button onPress={() => navigate('Main')}>
					<Text>Go back</Text>
				</Button>
			</Container>
		);
	}
}
