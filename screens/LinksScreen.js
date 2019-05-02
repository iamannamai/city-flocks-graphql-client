import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
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
          latitude: 40.710000, //40.704540
          longitude: -74.008000, //-74.009470
          latitudeDelta: 0.02, // 0.0922
          longitudeDelta: 0.009, // 0.0421
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
