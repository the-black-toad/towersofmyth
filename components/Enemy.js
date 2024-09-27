import React from 'react';
import { View, StyleSheet } from 'react-native';

const Enemy = ({ body }) => {
  // Check if the body is defined and has a position
  if (!body || !body.position) {
    return null;  // Return null if body or position is not available
  }
  
  return (
    <View style={[styles.enemy, { left: body.position.x, top: body.position.y }]} />
  );
};

const styles = StyleSheet.create({
  enemy: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'red',  // Visible background color for the enemy
  },
});

export default Enemy;
