import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { MapView } from 'expo';
import { Body, Button, H3, Header, Content, Right, Text } from 'native-base';
import Modal from 'react-native-modal';
import axios from 'axios';

import Layout from '../constants/Layout';
import { setSelectedEvent } from '../store/event';

class SingleEventModal extends Component {
  state = {
    polygonCoordinates: [],
    centerLat: this.props.event.latitude,
    centerLong: this.props.event.longitude,
    latDelta: this.props.event.longitudeDelta,
    longDelta: this.props.event.longitudeDelta
  };

  async componentDidMount() {
    const { geojson } = await this._getInitialRegion();

		const polygon = geojson.coordinates[0].map((coord) => ({
			latitude: coord[1],
			longitude: coord[0]
		}));

    this.setState({
      polygonCoordinates: polygon,
    });
  }

	_getInitialRegion = async () => {
		const area = this.props.event.location.replace(/\s/g, '+');
		/**
       Response has shape:
       {
        "lat": "40.7900869",
        "lon": "-73.9598295",
        "boundingbox": [
          "40.477399",
          "40.9161785",
          "-74.25909",
          "-73.7001809"
        ],
        "geojson": {
        "type": "Polygon",
        "coordinates": [
          [
            -74.0166816,
            40.7046987
          ]
        ]
      }
     */
		const { data: location } = await axios.get(
			`https://nominatim.openstreetmap.org/search.php?q=${area}&polygon_geojson=1&format=json`
		);

		return location[0];
	};

	render() {
		return (
			<Modal
				animationType="slide"
				transparent={true}
				backdropOpacity={0.3}
				isVisible={this.props.isModalVisible}
				onBackButtonPress={this.props.hideModal}
				onBackdropPress={this.props.hideModal}
				// onSwipeComplete={this.props.hideModal}
				onSwipeMove={this.props.hideModal}
				animationIn="fadeIn"
				animationOut="fadeOut"
				swipeDirection={[ 'up', 'left', 'right', 'down' ]}
				style={styles.modal}
			>
				<Header>
					<Body>
						<H3>{this.props.event.name}</H3>
					</Body>
					<Right>
						<Button small onPress={this.props.openMap}>
							<Text>{this.props.buttonText || 'Start Game'}</Text>
						</Button>
					</Right>
				</Header>
				<Content
					contentContainerStyle={{
						backgroundColor: 'rgba(255,255,255,1)'
					}}
				>
					<View>
						<MapView
							style={styles.mapView}
							provider="google"
							region={{
								latitude: this.state.centerLat,
								longitude: this.state.centerLong,
								latitudeDelta: this.state.latDelta,
								longitudeDelta: this.state.longDelta
							}}
							scrollEnabled={false}
						>
							{this.state.polygonCoordinates.length > 0 && (
								<MapView.Polygon
									coordinates={this.state.polygonCoordinates}
									fillColor="rgba(255,0,0,0.20)"
									strokeColor="rgba(255,0,0,0.80)"
								/>
							)}
						</MapView>
					</View>
					<View
						style={{
							paddingHorizontal: 5
						}}
					>
						<View style={styles.eventDetails}>
							<Text style={styles.eventMeta}>{this.props.event.location}</Text>
							<Text style={styles.eventMeta}>{`${this.props.event.duration / 3600} hr`}</Text>
						</View>
						<View style={{ paddingVertical: 10 }}>
							<Text note>{this.props.event.description}</Text>
						</View>
					</View>
				</Content>
			</Modal>
		);
	}
}

const mapState = (state) => ({
	event: state.event.allEvents.filter((event) => event.id === state.event.selectedEventId)[0]
});

export default connect(mapState)(SingleEventModal);

const styles = StyleSheet.create({
	eventDetails: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	eventMeta: {
		color: 'rgba(100,100,100,1)',
		fontWeight: '500'
	},
	mapView: {
		width: Layout.window.width * 0.8,
		height: Layout.window.width * 0.8
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
		width: '80%',
		marginLeft: '10%',
		marginTop: '15%'
	}
});
