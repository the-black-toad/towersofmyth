import Matter from "matter-js";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

export const moveEnemiesSystem = (entities, { time }) => {
  const enemy = entities.enemy;
  const path = entities.path;

  if (!enemy || !enemy.components.position || enemy.currentWaypointIndex >= path.length) {
    return entities;
  }

  const currentPos = enemy.components.position;

  // Get the current waypoint from the path
  const currentWaypoint = path[enemy.currentWaypointIndex];

  // Convert grid coordinates to actual x, y positions
  const targetX = currentWaypoint.col * 50;  // Adjust according to your GRID_SIZE
  const targetY = currentWaypoint.row * 50;

  const deltaX = targetX - currentPos.x;
  const deltaY = targetY - currentPos.y;
  const moveSpeed = 1;  // Movement speed

  console.log("current position", currentPos, "currentwaypoint:", currentWaypoint, "moving towards:", targetX, "with a delta of", deltaX);

  if (enemy.isWaiting) {
    // Decrease wait time or reset waiting state
    enemy.waitTime > 0 ? enemy.waitTime -= time : (enemy.isWaiting = false, enemy.currentWaypointIndex += 1, enemy.waitTime = 500);
  } else {
    // Prioritize X movement if deltaX is greater than deltaY
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Move right or left based on deltaX
      enemy.components.position.x += Math.sign(deltaX) * moveSpeed;
      Matter.Body.setVelocity(enemy.body, { x: Math.sign(deltaX) * moveSpeed, y: 0 });


    } else {
      // Move up or down based on deltaY
      enemy.components.position.y += Math.sign(deltaY) * moveSpeed;
      Matter.Body.setVelocity(enemy.body, { x: 0, y: Math.sign(deltaY) * moveSpeed });
      // update position 
      
    }
  
    // If the enemy has reached the waypoint, start waiting
    if (deltaX <= (moveSpeed/2) && deltaY <= (moveSpeed/2)) {
      enemy.isWaiting = true;
      enemy.waitTime = 500; // Wait for 500 milliseconds
    }

    // how do we update the position so that the calculation can go again 
    
  }
  return entities;
};


 
  
  // Handles tower attacking enemies
  export const towerAttackSystem = (entities, { time }) => {
    const towers = entities.towers;
    Object.values(towers).forEach((tower) => {
        console.log("in loop of towerAttack");
      const towerPosition = tower.components.position;
  
      // Check if any enemies are in range
      if (entities.enemy) {
        const enemyPosition = entities.enemy.components.position;
        const distance = Math.sqrt(
          Math.pow(towerPosition.x - enemyPosition.x, 2) +
            Math.pow(towerPosition.y - enemyPosition.y, 2)
        );
  
        // Attack if enemy is within range
        if (distance < 100) {
          entities.enemy.components.health.value -= tower.components.damage.value;
        }
      }
    });
  
    return entities;
  };
  