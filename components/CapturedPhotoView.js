import React from 'react';
import {View} from 'react-native';

const CapturedPhotoView = props => {
  const {photoUri} = props;
  return (
    <View>
      <Image
        source={{
          uri: photoUri
        }}>
        <View></View>
      </Image>
    </View>
  )
};

export default CapturedPhotoView;
