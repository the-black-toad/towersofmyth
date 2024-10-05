import React from 'react';
import { View, StyleSheet } from 'react-native';

const Enemy = ({ id, position }) => {
  const { x, y } = position;
  
  return (
    <View style={[styles.enemy, { left: x - 20, top: y - 20 }]} />
  );
};

const styles = StyleSheet.create({
  enemy: {
    width: 40,
    height: 40,
    backgroundColor: 'red', // Just for visualization
    position: 'absolute',
  },
});

export default Enemy;