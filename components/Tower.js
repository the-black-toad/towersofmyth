import React from 'react';
import { View, StyleSheet } from 'react-native';

const Tower = ({position}) => {
  //console.log(`Rendering Tower at: (${position.x}, ${position.y})`);  // Add log to confirm tower rendering
  return (
    <View style={[styles.tower, { left: position.x, top: position.y }]} />  // Adjust to center tower
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