// systems.js

import Matter from "matter-js";

const debugMovement = true;


const MOVE_SPEED = 2; // Increased from 1 to 2 for smoother movement
const GRID_SIZE = 50;

export const moveEnemiesSystem = (entities, { time, gameEngine }) => {
  if (!gameEngine || !gameEngine.dispatch) {
    console.warn("gameEngine or gameEngine.dispatch is undefined");
    return entities;
  }

  const enemies = entities.enemies;
  const path = entities.path;

  Object.values(enemies).forEach((enemy) => {
    if (!enemy || !enemy.body || enemy.currentWaypointIndex >= path.length) {
      return;
    }

    const currentPos = enemy.body.position;
    const currentWaypoint = path[enemy.currentWaypointIndex];
    const targetX = currentWaypoint.col * GRID_SIZE + GRID_SIZE / 2;
    const targetY = currentWaypoint.row * GRID_SIZE + GRID_SIZE / 2;

    const deltaX = targetX - currentPos.x;
    const deltaY = targetY - currentPos.y;

    const distanceToWaypoint = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distanceToWaypoint <= MOVE_SPEED) {
      // Reached the waypoint
      Matter.Body.setPosition(enemy.body, { x: targetX, y: targetY });
      enemy.currentWaypointIndex++;

      if (enemy.currentWaypointIndex === path.length) {
        gameEngine.dispatch({
          type: "ENEMY_REACHED_FINAL_WAYPOINT",
          enemyId: enemy.id,
          position: { x: targetX, y: targetY }
        });
      } else {
        gameEngine.dispatch({
          type: "ENEMY_REACHED_WAYPOINT",
          enemyId: enemy.id,
          position: { x: targetX, y: targetY }
        });
      }
    } else {
      // Move towards the next waypoint
      const moveX = (deltaX / distanceToWaypoint) * MOVE_SPEED;
      const moveY = (deltaY / distanceToWaypoint) * MOVE_SPEED;

      const newX = currentPos.x + moveX;
      const newY = currentPos.y + moveY;

      Matter.Body.setPosition(enemy.body, { x: newX, y: newY });

      gameEngine.dispatch({
        type: "ENEMY_MOVING",
        enemyId: enemy.id,
        position: { x: newX, y: newY }
      });
    }

    // Update enemy's position component for rendering
    enemy.components.position = { x: enemy.body.position.x, y: enemy.body.position.y };
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