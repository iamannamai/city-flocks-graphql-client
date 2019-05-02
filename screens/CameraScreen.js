import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, FileSystem, Permissions } from 'expo';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    image: {}
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasCameraPermission: status === 'granted' });
  }

  flipCameraOrientation() {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }

  async takePicture() {
    if (this.camera) {
      // photo contains { uri, width, height, exif, base64 }
      let photo = await this.camera.takePictureAsync({
        quality: 0
      });
      // use cache uri to save image to system
      this.setState({
        image: photo
      });
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.state.image.uri) {
      return (
        <View>
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: this.state.image.uri }}
          />
          {/* <Text>{this.state.image.uri}</Text> */}
          {/* <Text>{FileSystem.documentDirectory}</Text> */}
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => this.takePicture()}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
