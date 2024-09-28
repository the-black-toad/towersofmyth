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
  const targetX = currentWaypoint.col * .5;  // Adjust according to your GRID_SIZE
  const targetY = currentWaypoint.row * .5;

  const deltaX = targetX - currentPos.x;
  const deltaY = targetY - currentPos.y;
  const moveSpeed = 0.01;  // Movement speed

  // Check if the enemy is currently waiting
  if (enemy.isWaiting) {
    // Check how long the enemy has been waiting
    if (enemy.waitTime > 0) {
      enemy.waitTime -= time;  // Decrease wait time
    } else {
      // Reset waiting state and move to the next waypoint
      enemy.isWaiting = false;
      enemy.currentWaypointIndex += 1;
      enemy.waitTime = 500; // Reset wait time for the next waypoint (in milliseconds)
    }
  } else {
    // Move towards the target
    if (Math.abs(deltaX) > moveSpeed) {
      enemy.components.position.x += Math.sign(deltaX) * moveSpeed;
      enemy.body.position.x += Math.sign(deltaX) * moveSpeed;
    } else if (Math.abs(deltaY) > moveSpeed) {
      enemy.components.position.y += Math.sign(deltaY) * moveSpeed;
      enemy.body.position.y += Math.sign(deltaY) * moveSpeed;
    } else {
      // If the enemy has reached the waypoint, start waiting
      enemy.isWaiting = true;
      enemy.waitTime = 500; // Wait for 500 milliseconds
    }
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
  