export const createPathWithTurns = (numRows, numColumns, numTurns) => {
  let path = [];
  let direction = 'right';  // Start moving right
  let row = 0, col = 0;

  path.push({ row, col });

  // Calculate how far we should go between turns
  const maxSteps = Math.floor((numRows + numColumns) / (numTurns + 1));

  // Loop until we reach the bottom-right corner
  while (row < numRows - 1 || col < numColumns - 1) {
    if (direction === 'right') {
      // Move right until the end of the row or until maxSteps are reached
      for (let i = 0; i < maxSteps && col < numColumns - 1; i++) {
        col++;
        path.push({ row, col });
      }
      direction = 'down';  // Change direction to down after moving right
    } else if (direction === 'left') {
      // Move left until the start of the row or until maxSteps are reached
      for (let i = 0; i < maxSteps && col > 0; i++) {
        col--;
        path.push({ row, col });
      }
      direction = 'down';  // Change direction to down after moving left
    } else if (direction === 'down') {
      // Move down until the end of the column or until maxSteps are reached
      for (let i = 0; i < maxSteps && row < numRows - 1; i++) {
        row++;
        path.push({ row, col });
      }
      // Alternate between right and left after moving down
      direction = (path[path.length - 1].col === numColumns - 1) ? 'left' : 'right';
    }
  }

  return path;
};
