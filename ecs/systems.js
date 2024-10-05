// systems.js

import Matter from "matter-js";

const debugMovement = true;

export const moveEnemiesSystem = (entities, { time, gameEngine }) => {
  if (!gameEngine || !gameEngine.dispatch) {
    console.warn("gameEngine or gameEngine.dispatch is undefined");
    return entities;
  }

  const enemies = entities.enemies;
  const path = entities.path;

  Object.values(enemies).forEach((enemy) => {
    if (!enemy || !enemy.body || enemy.currentWaypointIndex >= path.length) {
      return; // Skip if enemy is invalid or has reached the end of the path
    }

    const currentPos = enemy.body.position;
    const currentWaypoint = path[enemy.currentWaypointIndex];
    const targetX = currentWaypoint.col * 50;
    const targetY = currentWaypoint.row * 50;

    const deltaX = targetX - currentPos.x;
    const deltaY = targetY - currentPos.y;
    const moveSpeed = 1;

    if (enemy.isWaiting) {
      // Handle waiting state
      if (enemy.waitTime > 0) {
        enemy.waitTime -= time.delta;
      } else {
        enemy.isWaiting = false;
        enemy.currentWaypointIndex += 1;
        enemy.waitTime = 500; // Reset wait time
      }
    } else {
      const distanceToWaypoint = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distanceToWaypoint <= moveSpeed * 0.5) {
        // Reached the waypoint
        enemy.isWaiting = true;
        enemy.waitTime = 250; // Wait at the waypoint

        if (enemy.currentWaypointIndex === path.length - 1) {
          Matter.Body.setVelocity(enemy.body, { x: 0, y: 0 }); // Stop at final waypoint

          gameEngine.dispatch({
            type: "ENEMY_REACHED_FINAL_WAYPOINT",
            enemyId: enemy.id,
            position: { x: targetX, y: targetY }
          });
        }

        gameEngine.dispatch({
          type: "ENEMY_REACHED_WAYPOINT",
          enemyId: enemy.id,
          position: { x: targetX, y: targetY }
        });
      } else {
        // Calculate and set velocity towards the next waypoint
        const velocityX = (deltaX / distanceToWaypoint) * moveSpeed;
        const velocityY = (deltaY / distanceToWaypoint) * moveSpeed;
        Matter.Body.setVelocity(enemy.body, { x: velocityX, y: velocityY });

        // Notify the game engine the enemy is moving and force re-render
        gameEngine.dispatch({
          type: "ENEMY_MOVING",
          enemyId: enemy.id,
          position: { x: currentPos.x, y: currentPos.y },
          velocity: { x: velocityX, y: velocityY }
        });

        // Update enemy's position component for rendering
        enemy.components.position = { x: currentPos.x, y: currentPos.y };
      }
    }
  });

  return entities;
};


/* currently broken
export const towerAttackSystem = (entities, { time }) => {
  const { towers, enemies } = entities;

  Object.values(towers).forEach((tower) => {
    const towerPosition = tower.components.position;

    Object.values(enemies).forEach((enemy) => {
      if (enemy && enemy.components && enemy.components.position && enemy.components.health) {
        const enemyPosition = enemy.components.position;
        const distance = Math.sqrt(
          Math.pow(towerPosition.x - enemyPosition.x, 2) +
          Math.pow(towerPosition.y - enemyPosition.y, 2)
        );

        if (distance < tower.components.range) {
          enemy.components.health.value -= tower.components.damage.value;
          console.log(`Tower attacked enemy. Enemy health: ${enemy.components.health.value}`);

          // Remove enemy if health drops to or below 0
          if (enemy.components.health.value <= 0) {
            delete entities.enemies[enemy.id];
            Matter.World.remove(entities.physics.world, enemy.body);
            console.log(`Enemy ${enemy.id} destroyed`);
          }
        }
      }
    });
  });

  return entities;
};*/