import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { createPathWithTurns } from './pathUtils';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 50;
const numColumns = Math.floor(width / GRID_SIZE);
const numRows = Math.floor(height / GRID_SIZE);

// Call the function with a specified number of turns (e.g., 3 turns)
const predefinedPath = createPathWithTurns(numRows, numColumns, 4);

const Grid = ({ onGridPress, path }) => {
  return (
    <View style={styles.grid}>
      {Array.from({ length: numColumns * numRows }).map((_, index) => {
        const row = Math.floor(index / numColumns);
        const col = index % numColumns;
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;

        // Check if the current cell is part of the path
        const isPathCell = path.some(p => p.row === row && p.col === col);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.gridCell, 
              { left: parseInt(x, 10) || 0, top: parseInt(y, 10) || 0 }, 
              isPathCell ? styles.pathCell : null  // Color the path cells
            ]}
            onPress={() => onGridPress(parseInt(x, 10) || 0, parseInt(y, 10) || 0)}
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
  pathCell: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',  // Color the path cells
  },
});

export default Grid;
