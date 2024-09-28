// pathUtils.js
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
        direction = 'down';  // Change direction
      } else if (direction === 'down') {
        // Move down until the end of the column or until maxSteps are reached
        for (let i = 0; i < maxSteps && row < numRows - 1; i++) {
          row++;
          path.push({ row, col });
        }
        direction = 'right';  // Change direction
      }
    }
  
    return path;
  };
  