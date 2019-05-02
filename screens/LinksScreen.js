import React from 'react';
import { ScrollView, StyleSheet,Text,View } from 'react-native';
import { MapView,Location,Permissions,TaskManager } from 'expo';
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
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    Location.startGeofencingAsync("geofence",[{ latitude: 40.7051276, longitude: -74.0092019,radius: 10 }]);
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
          coordinate={{ latitude: 40.7051276, longitude: -74.0092019 }}
          name="Test"
          description="This is a test"
        />
      </MapView>
    );
  }
}

TaskManager.defineTask("geofence", ({data: {eventType,region}, error}) => {
  if(error) {
    return;
  }
  if(eventType === Location.GeofencingEventType.Enter) {
    console.log("You entered region:", region);
  }
  else if(eventType === Location.GeofencingEventType.Exit) {
    console.log("You left region:", region);
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
