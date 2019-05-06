import React from 'react';
import { Text, View, Image } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { Camera, MediaLibrary, Permissions } from 'expo';
import { Storage } from 'aws-amplify';
import { uriToBlob } from './util/cameraUtils';
import deviceDim from '../constants/Layout';
import CameraToolbar from './CameraToolbar';

class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    photoUri: ''
  };

  async componentDidMount() {
    const [
      cameraPerms,
      cameraRollPerms
    ] = await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL)
    ]);

    const {status: cameraStatus} = cameraPerms;
    const {status: cameraRollStatus} = cameraRollPerms;

    this.setState({
      hasCameraPermission: cameraStatus === 'granted',
      hasCameraRollPermission: cameraRollStatus === 'granted'
    });
  }

  flipCameraOrientation = () => {
    const type = this.state.type === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back;

    this.setState({ type });
  }

  takePicture = async () => {
    if (this.camera) {
      // response (photo) has shape { uri, width, height, exif, base64 }
      let photo = await this.camera.takePictureAsync({
        quality: 0
      });

      // const asset = await MediaLibrary.createAssetAsync(photo.uri);
      this.setState({
        photoUri: photo.uri
      });
    }
  }

  uploadFile = async () => {
    // use cache uri to save image to system
    const response = await uriToBlob(this.state.photoUri);
    // TODO: construct fileName from event/task
    const fileName = Math.random() + '-test-image.jpg';

    // res returns an object with a key that points to the
    const res = await Storage.put(fileName, response, {
      contentType: 'image/jpg'
    });

    console.log(res);
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View />
      );
    // Test Image render
    } else if (!hasCameraPermission) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      );
    } else if (this.state.photoUri) {
      return (
        <View style={{ flex: 1 }}>
          <Image
            style={{
              flex: 1
            }}
            source={{ uri: this.state.photoUri }}
          />
        </View>
      );
    // Main camera view
    } else {
      return (
        this.props.isFocused && (
          <View style={{ flex: 1 }}>
            <Camera
              style={{
                flex: 1,
                // width: deviceDim.window.width,
                // height: deviceDim.window.width * 1.33,
              }}
              type={this.state.type}
              ref={ref => { this.camera = ref; }}
              >
              <CameraToolbar
                flipCameraOrientation={this.flipCameraOrientation}
                takePicture={this.takePicture}
              />
            </Camera>
          </View>
        )
      );
    }
  }
}

// Unmounts Camera when it is not the focused view
export default withNavigationFocus(CameraView);
