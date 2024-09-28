import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { createEnemy, createTower } from './ecs/entities';
import { moveEnemiesSystem, towerAttackSystem } from './ecs/systems';
import Grid from './components/Grid';
import Tower from './components/Tower';  // Import Tower component
import { createPathWithTurns } from './components/pathUtils';

const { width, height } = Dimensions.get('window');

export default function App() {


  const GRID_SIZE = 50;
  const numColumns = Math.floor(width / GRID_SIZE);
  const numRows = Math.floor(height / GRID_SIZE);
  
  // Call the function with a specified number of turns (e.g., 3 turns)
  const predefinedPath = createPathWithTurns(numRows, numColumns, 4);

  // Initialize entities with a default structure
  const [entities, setEntities] = useState({
    physics: { engine: null, world: null },  // Default physics object
    enemy: null,  // Initially set enemy to null
    towers: {},  // Start with empty towers
    path: predefinedPath, 
  });


  useEffect(() => {
    // Create Matter.js engine and world
    const engine = Matter.Engine.create();
    const world = engine.world;
       // Disable gravity
    world.gravity.y = 0;  // This disables vertical gravity
    world.gravity.x = 0; 

    // Create the enemy entity after the world has been created
    const enemy = createEnemy(world, { x: predefinedPath[0].col * 50, y: predefinedPath[0].row * 50 });
    enemy.currentWaypointIndex = 0;

    console.log("we hit this useEffect");

    // Safely initialize entities
    setEntities({
      physics: { engine, world },
      enemy: enemy,  // Set the created enemy here
      towers: {},  // Keep towers empty
      path: predefinedPath,
      
    });

    const interval = setInterval(() => {
      Matter.Engine.update(engine, 1000 / 60);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);  // Empty dependency array to run only once on mount

  const handleGridPress = (x, y) => {
    console.log(`Grid pressed at: (${x}, ${y})`); // Debugging log
    
    // Create the tower with the given x and y coordinates
    const tower = createTower({ x: x, y: y });

    // Update the entities to include the new tower
    setEntities((prev) => {
      const updatedTowers = {
        ...prev.towers,  // Keep existing towers
        [tower.id]: tower,  // Add new tower by its unique id
      };

      return {
        ...prev,  // Keep other entities like the enemy and physics
        towers: updatedTowers,  // Update towers in the state
      };
      
    });
  };

   // Log the current state of entities to check if the enemy has been initialized
   console.log("Current Entities State:", entities);

  // Ensure entities are not null when passed to GameEngine
  if (!entities.physics.engine || !entities.enemy) {
    console.log("Physics engine or enemy not initialized");
    return null;  // Don't render until entities are fully initialized
  }

  return (
    <View style={styles.container}>
      <GameEngine
        style={styles.gameContainer}
        systems={[moveEnemiesSystem, towerAttackSystem]}
        entities={entities}
      >
        <Grid onGridPress={handleGridPress} path={predefinedPath} /> 
     
        {Object.values(entities.towers).map(tower => (
          <Tower key={tower.id} position={tower.components.position} />
        ))}
      </GameEngine>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    width: width,
    height: height,
  },
});
