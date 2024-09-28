import Matter from 'matter-js';
import { Position, Health, Damage } from './components';
import Enemy from '../components/Enemy';  // Import Enemy component
import Tower from '../components/Tower';  // Import Tower component

let entityId = 0;


export const createEnemy = (world, { x, y }) => {
  const body = Matter.Bodies.rectangle(x, y, 40, 40, {
    isStatic: false,
  });
  
  Matter.World.add(world, body);

  return {
    id: entityId++,  // Unique ID for the enemy
    body,  // Ensure this is defined
    components: {
      position: new Position(x, y),
      health: new Health(100),
      damage: new Damage(10),
    },
    isWaiting: false,    // Initialize waiting state
    waitTime: 500,       // Set default wait time (in milliseconds)
    currentWaypointIndex: 0,  // Initialize waypoint index
    renderer: <Enemy body={body} />,  // Pass the body to the Enemy renderer
  };
};
export const createTower = ({ x, y }) => {
    console.log("Creating tower: ", x, y);
    return {
        id: entityId++,  // Unique ID for the tower
        components: {
            position: new Position(x, y),
            damage: new Damage(20),
        },
        renderer: <Tower position={new Position(x, y)} />, // Renderer must be a component
    };
};
  
