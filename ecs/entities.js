import Matter from 'matter-js';
import { Health, Damage } from './components';
import Enemy from '../components/Enemy'; // Import Enemy component
import Tower from '../components/Tower'; // Import Tower component

let towerid = 0;
let enemyid = 0;

export const createEnemy = (world, { x, y }) => {
  const body = Matter.Bodies.rectangle(x, y, 40, 40, {
    isStatic: false,
    isSensor: true,
    collisionFilter: {group: -1},
  });
  
  Matter.World.add(world, body);
  
  return {
    id: enemyid++, // Unique ID for the enemy
    body, // Matter.js body for the enemy
    components: {
      health: new Health(100),
      damage: new Damage(10),
    },
    isWaiting: false, // Initialize waiting state
    waitTime: 500, // Set default wait time (in milliseconds)
    currentWaypointIndex: 0, // Initialize waypoint index
    renderer: Enemy,
  };
};

export const createTower = (world, { x, y }) => {
  
  console.log(`Creating tower at: (${x}, ${y})`); 
  const body = Matter.Bodies.rectangle(x, y, 40, 40, {
    isStatic: true,
    
  });
  
  Matter.World.add(world, body);
  
  return {
    id: towerid++, // Unique ID for the tower
    body, // Matter.js body for the tower
    components: {
      damage: new Damage(20),
    },
    renderer: Tower,
  };
};