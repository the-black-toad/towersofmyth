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
    id: enemyid++,
    body,
    components: {
      health: new Health(100),
      damage: new Damage(1),
    },
    isWaiting: false,
    waitTime: 500,
    currentWaypointIndex: 0,
    renderer: Enemy,
  };
};

export const createTower = (world, { x, y }) => {
  const body = Matter.Bodies.rectangle(x, y, 40, 40, {
    isStatic: true,
  });
  
  Matter.World.add(world, body);
  
  return {
    id: towerid++,
    body,
    components: {
      damage: new Damage(1),
      range: 150,
    },
    renderer: Tower,
  };
};