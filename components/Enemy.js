import React from 'react';
import { View, Text } from 'react-native';

const Enemy = ({ position, health }) => (
  <View style={{
    position: 'absolute',
    left: position.x - 20,
    top: position.y - 20,
    width: 40,
    height: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Text style={{ color: 'white' }}>{Math.max(health, 0)}</Text>
  </View>
);

export default Enemy;