import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

type GridItem = {
  id: number;
  row: number;
  column: number;
};

export default function TabTwoScreen() {
  const rows = 10;
  const columns = 6;

  // Static 2D grid stored in state
  const [grid, setGrid] = useState<GridItem[][]>(createStaticGrid(rows, columns));

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
        });
      }
      grid.push(rowItems);
    }

    return grid;
  }

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {grid.flat().map((item) => (
        <View key={item.id} style={styles.gridItem}>
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
    width: 50,
    height: 50,
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
});
