import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Dimensions, Button, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { createEnemy, createTower } from './ecs/entities';
import { moveEnemiesSystem, towerAttackSystem } from './ecs/systems';
import Grid from './components/Grid';
import Tower from './components/Tower';
import Enemy from './components/Enemy';
import { createPathWithTurns } from './components/pathUtils';

const pathTurns = (Math.floor(Math.random() * 4 ) + 1)
const { width, height } = Dimensions.get('window');

export default function App() {
  const GRID_SIZE = 50;
  const numColumns = Math.floor(width / GRID_SIZE);
  const numRows = Math.floor(height / GRID_SIZE);
  const [lives, setLives] = useState(10);  // Initialize with 10 lives
  const [econ, setEcon] = useState(100);  // Initialize econ with 100
  const predefinedPath = createPathWithTurns(numRows, numColumns, pathTurns);

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
  }, []);

  const handleGridPress = (x, y) => {
    console.log(`Grid pressed at: (${x}, ${y})`);
  
    // Convert pixel coordinates to grid coordinates
    const col = Math.floor(x / GRID_SIZE);
    const row = Math.floor(y / GRID_SIZE);
  
    //console.log(`Converted to grid coordinates: (${col}, ${row})`);
  
    // Check if the grid cell is part of the predefined path
    const isOnPath = predefinedPath.some(pathSegment => pathSegment.col === col && pathSegment.row === row);
  
    if (isOnPath) {
      console.log('Cannot place a tower on the path!');
      return; // Prevent tower creation
    }

        // Check if there's enough econ to place the tower
    if (econ < 100) {
      console.log('Not enough econ to place a tower!');
      return; // Prevent tower creation if not enough econ
    }

    // Deduct 100 econ and place the tower
    setEcon(prevEcon => prevEcon - 100);
  
    // If not on the path, proceed with tower creation
    const tower = createTower(entities.physics.world, { x, y });
    
    setEntities(prevEntities => ({
      ...prevEntities,
      towers: {
        ...prevEntities.towers,
        [tower.id]: tower,
      },
    }));
  };
  

  const handleSpawnEnemy = () => {
    const enemy = createEnemy(entities.physics.world, {
      x: predefinedPath[0].col * GRID_SIZE,
      y: predefinedPath[0].row * GRID_SIZE
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

  // Render function to use the latest enemy positions
  const renderEntities = useCallback(() => {
    return (
      <>
        {Object.values(entities.enemies).map((enemy) => (
          <Enemy 
            key={enemy.id} 
            position={enemy.body.position || enemy.components.position} 
          />
        ))}
        {Object.values(entities.towers).map((tower) => (
          <Tower 
            key={tower.id} 
            position={tower.body.position || tower.components.position} 
          />
        ))}
      </>
    );
  }, [entities.enemies, entities.towers]);

  
  const enemyPositionsRef = useRef({});
  const updateQueueRef = useRef({});

  const handleEvent = useCallback((event) => {
    switch (event.type) {
      case 'ENEMY_MOVING':
        enemyPositionsRef.current[event.enemyId] = event.position;
        updateQueueRef.current[event.enemyId] = true;
        break;
      case 'ENEMY_REACHED_WAYPOINT':
        // Handle waypoint logic here if needed
        break;
      case 'ENEMY_REACHED_FINAL_WAYPOINT':
        // Delete the enemy from the entities
        setEntities(prevEntities => {
          const updatedEnemies = { ...prevEntities.enemies };
          delete updatedEnemies[event.enemyId];
          
          // Remove the enemy's body from the physics world
          Matter.World.remove(prevEntities.physics.world, prevEntities.enemies[event.enemyId].body);
          
          setLives(prevLives => Math.max(prevLives - 1, 0));
          return { ...prevEntities, enemies: updatedEnemies };
        });
        console.log(`Enemy ${event.enemyId} reached final waypoint and was removed`);
        break;
      default:
        break;
    }
  }, []);

  const updateEnemyPositions = useCallback(() => {
    if (Object.keys(updateQueueRef.current).length > 0) {
      setEntities(prevEntities => {
        const updatedEnemies = { ...prevEntities.enemies };
        Object.keys(updateQueueRef.current).forEach(enemyId => {
          if (updatedEnemies[enemyId]) {
            updatedEnemies[enemyId] = {
              ...updatedEnemies[enemyId],
              components: {
                ...updatedEnemies[enemyId].components,
                position: enemyPositionsRef.current[enemyId]
              }
            };
          }
        });
        updateQueueRef.current = {};
        return { ...prevEntities, enemies: updatedEnemies };
      });
    }
  }, []);

  useEffect(() => {
    let frameId;
    const updateFrame = () => {
      updateEnemyPositions();
      frameId = requestAnimationFrame(updateFrame);
    };
    frameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(frameId);
  }, [updateEnemyPositions]);
  
  return (
    <View style={styles.container}>
      <GameEngine
        ref={setGameEngine}
        style={styles.gameContainer}
        systems={[updateEntitiesHandler, (entities, args) => moveEnemiesSystem(entities, { ...args, gameEngine })]} 
        entities={entities}
        onEvent={handleEvent}
      >
        <Grid onGridPress={handleGridPress} path={predefinedPath} />
        {renderEntities(entities)} 
      </GameEngine>
      <View style={styles.controls}>
        <Button title="Spawn Enemy" onPress={handleSpawnEnemy} />
        <Text style={styles.livesText}>Lives: {lives}</Text>
        <Text style={styles.econText}>Econ: {econ}</Text> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
  },
  gameContainer: {
    width: width,
    height: height - 50, // Adjust to make space for the button
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  livesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  econText: {  // Style for the econ display
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});