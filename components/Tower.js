import { Body } from 'matter-js';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Tower = ({body}) => {

  const { x, y } = body.position;
  //console.log(`Rendering Tower at: (${position.x}, ${position.y})`);  // Add log to confirm tower rendering
  return (
    <View style={[styles.tower, { left: x, top: y }]} />  // Adjust to center tower
  );
};

const styles = StyleSheet.create({
  tower: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'blue',  // Ensure tower has a visible color
  },
});

export default Tower;