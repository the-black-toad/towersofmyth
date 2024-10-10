import React from 'react';
import { View } from 'react-native';

const Tower = ({ position, range}) => (
  <View>
    <View style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      width: 40,
      height: 40,
      backgroundColor: 'blue',
    }} />
    <View style={{
      position: 'absolute',
      left: position.x - range,
      top: position.y - range,
      width: range * 2,
      height: range * 2,
      borderRadius: range,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 255, 0.3)',
    }} />
  </View>
);

export default Tower;