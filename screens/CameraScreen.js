import React from 'react';
import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, MediaLibrary, Permissions } from 'expo';
import { storage } from '../Secrets/firestore'



export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    asset: {}
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

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
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      if (!photo.cancelled) {
        this.uploadImage(photo.uri, "testImage").then(() => {
          Alert.alert('Success')
        }).catch((err) => {
          Alert.alert(err)
        })
      }


      // const uploadTask = storage.ref(`image/${photo.uri}`).put(photo)

      // uploadTask.on('state_changed',
      //   (snapshot) => {
      //     // progress function
      //   },
      //   (error) => {
      //     //error function
      //     console.log(error)
      //   },
      //   () => {
      //     //complete function
      //     storage.ref('image').child(photo.uri).getDownloadURL().then(url => {
      //       console.log(url)
      //     })
      //   });

      this.setState({
        asset
      });
    }
  }

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri)
    const blob = await response.blob()
    let ref = storage.ref().child(`images/${imageName}`)
    return ref.put(blob)
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.state.asset.uri) {
      return (
        <View>
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: this.state.asset.uri }}
          />
          {/* <Text>{`(${this.state.asset.location.latitude},${this.state.asset.location.longitude}`}</Text> */}
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
