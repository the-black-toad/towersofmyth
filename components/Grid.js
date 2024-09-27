import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 50;
const numColumns = Math.floor(width / GRID_SIZE);
const numRows = Math.floor(height / GRID_SIZE);

const Grid = ({ onGridPress }) => {
  return (
    <View style={styles.grid}>
      {Array.from({ length: numColumns * numRows }).map((_, index) => {
        const row = Math.floor(index / numColumns);
        const col = index % numColumns;
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.gridCell, { left: x, top: y }]}
            onPress={() => onGridPress(x, y)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridCell: {
    position: 'absolute',
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Grid;
