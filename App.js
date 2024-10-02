import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { createEnemy, createTower } from './ecs/entities';
import { moveEnemiesSystem, towerAttackSystem } from './ecs/systems';
import Grid from './components/Grid';
import Tower from './components/Tower';
import { createPathWithTurns } from './components/pathUtils';

const { width, height } = Dimensions.get('window');

export default function App() {
  const GRID_SIZE = 50;
  const numColumns = Math.floor(width / GRID_SIZE);
  const numRows = Math.floor(height / GRID_SIZE);
  
  const predefinedPath = createPathWithTurns(numRows, numColumns, 4);

  const [gameEngine, setGameEngine] = useState(null);
  const [entities, setEntities] = useState({
    physics: { engine: null, world: null },
    enemies: {},
    towers: {},
    path: predefinedPath,
  });

  

  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0;
    world.gravity.x = 0;

    setEntities(prevEntities => ({
      ...prevEntities,
      physics: { engine, world },
    }));

    const interval = setInterval(() => {
      Matter.Engine.update(engine, 1000 / 60);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, );

  const handleGridPress = (x, y) => {
    console.log(`Grid pressed at: (${x}, ${y})`);
    const tower = createTower({ x, y });
    setEntities(prevEntities => ({
      ...prevEntities,
      towers: {
        ...prevEntities.towers,
        [tower.id]: tower,
      },
    }));
    if (gameEngine) {
      gameEngine.dispatch({ type: 'add-tower', tower });
    }
  };

  const handleSpawnEnemy = () => {
    const enemy = createEnemy(entities.physics.world, { 
      x: predefinedPath[0].col * 50, 
      y: predefinedPath[0].row * 50 
    });
    enemy.currentWaypointIndex = 0;
    
    setEntities(prevEntities => ({
      ...prevEntities,
      enemies: {
        ...prevEntities.enemies,
        [enemy.id]: enemy,
      },
    }));
    if (gameEngine) {
      gameEngine.dispatch({ type: 'add-enemy', enemy });
    }
  };

  const updateEntitiesHandler = (entities, { touches, dispatch, events }) => {
    let updatedEntities = { ...entities };

    if (events.length) {
      events.forEach((e) => {
        if (e.type === 'add-tower') {
          updatedEntities.towers[e.tower.id] = e.tower;
        } else if (e.type === 'add-enemy') {
          updatedEntities.enemies[e.enemy.id] = e.enemy;
        }
      });
    }

    return updatedEntities;
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => { setGameEngine(ref) }}
        style={styles.gameContainer}
        systems={[updateEntitiesHandler, moveEnemiesSystem, towerAttackSystem]}
        entities={entities}
      >
        <Grid onGridPress={handleGridPress} path={predefinedPath} />
        {Object.values(entities.towers).map(tower => (
          <Tower key={tower.id} position={tower.components.position} />
        ))}
        {Object.values(entities.enemies).map(enemy => {
          const EnemyRenderer = enemy.renderer;
          return (
            <EnemyRenderer key={enemy.id} position={enemy.body.position} />
          );
        })}
      </GameEngine>
      
      <View style={styles.buttonContainer}>
        <Button title="Spawn Enemy" onPress={handleSpawnEnemy} />
      </View>
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
    height: height - 50,  // Adjust to make space for the button
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
});
