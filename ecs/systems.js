import Matter from "matter-js";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
export const moveEnemiesSystem = (entities, { time }) => {
  const enemy = entities.enemy;
  const path = entities.path;

  if (!enemy || !enemy.components.position || enemy.currentWaypointIndex >= path.length) {
    return entities;
  }

  const currentPos = enemy.body.position;  // Use Matter.js body position directly

  // Get the current waypoint from the path
  const currentWaypoint = path[enemy.currentWaypointIndex];

  // Convert grid coordinates to actual x, y positions
  const targetX = currentWaypoint.col * 50;  // Assuming GRID_SIZE is 50
  const targetY = currentWaypoint.row * 50;

  const deltaX = targetX - currentPos.x;
  const deltaY = targetY - currentPos.y;
  const moveSpeed = 1;  // Movement speed
   // Calculate the Euclidean distance to the waypoint
   console.log("current position", currentPos, "current waypoint:", currentWaypoint, "moving towards:", targetX, "with a delta of", deltaX);

   if (enemy.isWaiting) {
     // Decrease wait time or reset waiting state
     if (enemy.waitTime > 0) {
       enemy.waitTime -= time;
     } else {
       enemy.isWaiting = false;
       enemy.currentWaypointIndex += 1;  // Move to the next waypoint
       enemy.waitTime = 500;  // Reset wait time for the next waypoint
     }
   } else {
     // Move the enemy towards the target by scaling the speed in both X and Y directions
     const distanceToWaypoint = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
 
     // If the enemy is close enough to the waypoint, start waiting
     if (distanceToWaypoint <= moveSpeed * 0.5) {
      // Snap to the exact waypoint
      Matter.Body.setPosition(enemy.body, { x: targetX, y: targetY });
      enemy.isWaiting = true;  // Start waiting
      enemy.waitTime = 250; // Wait for 500 milliseconds
      
      // Check if this is the last waypoint
      if (enemy.currentWaypointIndex === path.length - 1) {
        // If it's the last waypoint, stop the enemy's movement
        Matter.Body.setVelocity(enemy.body, { x: 0, y: 0 });
        console.log("Reached final waypoint:", { x: targetX, y: targetY });
      }
      console.log("Reached waypoint:", { x: targetX, y: targetY });
     } else {
       // Calculate velocity
       const velocityX = (deltaX / distanceToWaypoint) * moveSpeed;
       const velocityY = (deltaY / distanceToWaypoint) * moveSpeed;
 
       // Apply velocity to the enemy
       Matter.Body.setVelocity(enemy.body, { x: velocityX, y: velocityY });
     }
   }
 
   // Sync the components.position with Matter.js body position
   enemy.components.position.x = enemy.body.position.x;
   enemy.components.position.y = enemy.body.position.y;
 
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
  