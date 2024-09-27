// Moves enemies across the grid
export const moveEnemiesSystem = (entities, { time }) => {
    const enemy = entities.enemy;
    if (enemy && enemy.components.position) {
      // Move enemy by updating position
      enemy.components.position.x += .01; // Move enemy horizontally
      enemy.body.position.x += .01; // Sync Matter.js body position
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
  