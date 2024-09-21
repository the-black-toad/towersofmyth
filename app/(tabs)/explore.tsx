import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { createLongestPath, GridItem } from '../pathfinding'; // Import the pathfinding algorithm

export default function TabTwoScreen() {
  const rows = 14;
  const columns = 8;
  const screenWidth = Dimensions.get('window').width;
  const gridItemSize = screenWidth / columns - 10;

  // Static 2D grid stored in state
  const [grid, setGrid] = useState<GridItem[][]>(createStaticGrid(rows, columns));
  const [path, setPath] = useState<GridItem[]>([]);

  useEffect(() => {
    const longestPath = createLongestPath(grid);
    setPath(longestPath);
  }, [grid]);

  // Create a static grid (2D array) that can be referenced later
  function createStaticGrid(rows: number, columns: number): GridItem[][] {
    const grid: GridItem[][] = [];
    let id = 1;

    for (let row = 0; row < rows; row++) {
      const rowItems: GridItem[] = [];
      for (let col = 0; col < columns; col++) {
        rowItems.push({
          id: id++,
          row: row,
          column: col,
          visited: false,
        });
      }
      grid.push(rowItems);
    }

    return grid;
  }

  // Helper function to check if a grid item is part of the path
  const isPartOfPath = (item: GridItem) => path.some((pathItem) => pathItem.id === item.id);

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {grid.flat().map((item) => (
        <View
          key={item.id}
          style={[
            styles.gridItem,
            { width: gridItemSize, height: gridItemSize },
            isPartOfPath(item) ? styles.pathItem : null, // Apply red background if it's part of the path
          ]}
        >
          <Text>{`${item.row},${item.column}`}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 50,
  },
  gridItem: {
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  pathItem: {
    backgroundColor: 'red', // Turn the grid item red if it's part of the path
  },
});
