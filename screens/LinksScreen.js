import React from 'react';
import { ScrollView, StyleSheet,Text,View } from 'react-native';
import { MapView,Location,Permissions,TaskManager, Notifications } from 'expo';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  state = {
    location: null,
    errorMessage: null
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });

  };

  render() {
	let hanoverAndBeaver = { latitude: 40.705387, longitude: -74.008957 };
	let hanoverAndExchange = { latitude: 40.705537, longitude: -74.009145 };
	let wallAndWilliam = { identifier: 'wallAndWilliam', latitude: 40.706356, longitude: -74.009529 };
	let empireState = { latitude: 40.748393, longitude: -73.985622 };
	let radius = 12;

    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    Location.startGeofencingAsync("geofence",[{...wallAndWilliam, radius}]);
    return (
      //   <ScrollView style={styles.container}>
      //     {/* Go ahead and delete ExpoLinksView and replace it with your
      //        * content, we just wanted to provide you with some helpful links */}
      //     <ExpoLinksView />
      //   </ScrollView>
      <MapView
        showsUserLocation={true}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 40.71, //40.704540
          longitude: -74.008, //-74.009470
          latitudeDelta: 0.02, // 0.0922
          longitudeDelta: 0.009 // 0.0421
        }}
      >
        <MapView.Marker
          coordinate={wallAndWilliam}
          name="Test"
          description="This is a test"
        />
      </MapView>
    );
  }
}

// const someNotification = Notifications.addListener((obj) => {
// 	// const { origin, data, remote } = obj
// 	console.log('I listened!');
// 	console.log(obj);
// });

// const plainNotification = {
// 	title: 'Test Notification',
// 	body: 'Her is the body of the notification'
// };

TaskManager.defineTask("geofence", ({data, error}) => {
  if(error) {
    return;
  }
  if(data.eventType === Location.GeofencingEventType.Enter) {
	console.log("You entered region:", data.region);
	// Notifications.presentLocalNotificationAsync(someNotification);
	// console.log(data);
	const someNotification = Notifications.addListener((obj) => {
		// const { origin, data, remote } = obj
		console.log('I listened!');
		console.log(obj);
	});
	console.log(someNotification);
  }
  else if(data.eventType === Location.GeofencingEventType.Exit) {
	console.log("You left region:", data.region);
	// Notifications.presentLocalNotificationAsync(someNotification);
	const someNotification = Notifications.addListener((obj) => {
		// const { origin, data, remote } = obj
		console.log('I listened!');
		console.log(obj);
	});
	console.log(someNotification);
	// console.log(data);
  }
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
