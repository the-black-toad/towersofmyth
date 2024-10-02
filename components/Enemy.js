import React from 'react';
import { View, StyleSheet } from 'react-native';

const Enemy = ({ position }) => {
  const { x, y } = position;  // Get the current position from Matter.js

  return (
    <View style={[styles.enemy, { left: x, top: y }]} />
  );
};

const styles = StyleSheet.create({
  enemy: {
    width: 40,
    height: 40,
    backgroundColor: 'red',  // Just for visualization
    position: 'absolute',
  },
});

export default Enemy;
