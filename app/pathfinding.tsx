export type GridItem = {
    id: number;
    row: number;
    column: number;
    visited: boolean;
};

export function createLongestPath(grid: GridItem[][]): GridItem[] {
    const rows = grid.length;
    const columns = grid[0].length;
    const path: GridItem[] = [];

    let currentRow = 0;
    let currentColumn = 0;

    while (currentRow < rows) {
        // Traverse the current row in the direction (left to right or right to left)
        while (currentColumn >= 0 && currentColumn < columns) {
            if (!grid[currentRow][currentColumn].visited) {
                grid[currentRow][currentColumn].visited = true;
                path.push(grid[currentRow][currentColumn]); // Add current cell to the path
            }

            // Move to the next column
            currentColumn++;
        }

        // If we hit the last column, process the column, move to the next row
        if (currentColumn >= columns) {
            // Add the last column of the current row to the path
            if (!grid[currentRow][columns - 1].visited) {
                grid[currentRow][columns - 1].visited = true;
                path.push(grid[currentRow][columns - 1]); // Add the last cell of the row
            }

            // Move to the next row
            currentRow++;
            // Reset the column to the same position
            currentColumn = columns - 1;
            
            // Continue from the next row and add the current column to the path
            if (currentRow < rows) {
                if (!grid[currentRow][currentColumn].visited) {
                    grid[currentRow][currentColumn].visited = true;
                    path.push(grid[currentRow][currentColumn]); // Add cell to the path
                }
            }

            // Move to the next row
            currentRow++;
            // Reset the column to the start of the new row
            currentColumn = 0;
        }
    }

    return path; // Return the longest path through the grid
}
