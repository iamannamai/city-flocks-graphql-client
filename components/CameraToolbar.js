import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CameraToolbar = props => {
  const { takePicture, flipCameraOrientation } = props;
  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between'
    }}>
      <TouchableOpacity
        style={{
          flex: 1,
          alignSelf: 'flex-end',
          alignItems: 'center',
          margin: 20
        }}
        onPress={() => flipCameraOrientation()}>
        <Ionicons
          name={ Platform.OS === 'ios' ? 'ios-reverse-camera' : 'md-reverse-camera' }
          size={32}
          color="white"
          />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          // flex: 1,
          alignSelf: 'center',
          alignItems: 'flex-end',
          width: 60,
          height: 60,
          borderWidth: 2,
          borderRadius: 60,
          borderColor: "#FFFFFF",
          marginBottom: 20
        }}
        onPress={() => takePicture()} />
    </View>
  );
};

export default CameraToolbar;
