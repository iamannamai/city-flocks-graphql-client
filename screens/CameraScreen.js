import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, MediaLibrary, Permissions } from 'expo';
// import { RNS3 } from 'react-native-aws3';
import {Storage} from 'aws-amplify';
// import RNFetchBlob from 'react-native-fetch-blob';

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

      // Upload with credentials...
      // const file = {
      //   // `uri` can also be a file system path (i.e. file://)
      //   uri: photo.uri,
      //   name: 'image.jpg',
      //   type: 'image/jpg'
      // };

      // RNS3.put(file, awsS3Options).then(response => {
      //   if (response.status !== 201)
      //     throw new Error("Failed to upload image to S3");
      //   console.log(response.body);
      //   /**
      //    * {
      //    *   postResponse: {
      //    *     bucket: "your-bucket",
      //    *     etag : "9f620878e06d28774406017480a59fd4",
      //    *     key: "uploads/image.png",
      //    *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
      //    *   }
      //    * }
      //    */
      // });

      // const imageData = await RNFetchBlob.fs.readFile(photo.uri, 'base64');
      // const imageUpload = new Buffer(imageData, 'base64');
      const uriToBlob = (url) => {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob'; // convert type
            xhr.send();
        })
      }

      const response = await uriToBlob(photo.uri);
      const fileName = 'test-image.jpg';

      console.log(response);
      const res = await Storage.put(fileName, response, {
        contentType: 'image/jpg'
      });

      console.log(res);

      this.setState({
        asset
      });
    }
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
            source={{ uri: this.state.asset.uri}}
          />
          <Text>{`(${this.state.asset.location}`}</Text>
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
