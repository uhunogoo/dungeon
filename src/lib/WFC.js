/**
 * Creates a predictable random function from a seed
 */
function createRandomFunction(seed) {
  // Simple xorshift for deterministic random numbers
  let state = typeof seed === 'number' ? seed : parseInt(seed, 10);
  if (isNaN(state)) {
    state = Date.now();
  }
  state = state === 0 ? 1 : state; // Ensure state is not zero

  return function() {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

/**
 * Groups tiles by their base type for easier selection
 */
function groupTilesByType(tile_catalog) {
  const groups = {};
  Object.entries(tile_catalog).forEach(([tileName, tile]) => {
    const baseType = tile.baseType || tileName; // Use baseType or fall back to name
    if (!groups[baseType]) {
      groups[baseType] = [];
    }
    groups[baseType].push(tileName);
  });
  return groups;
}

/**
 * Initialize the WFC grid with all tiles as options
 */
function initializeGrid(width, height, allTileNames) {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      collapsed: false,
      options: [...allTileNames], // Store tile names as options
      tile: null,
    }))
  );
}

/**
 * Get valid neighbor cells for a position and the direction TO the neighbor
 */
function getNeighbors(row, col, gridWidth, gridHeight) {
  const neighbors = [];
  // Direction is from (row, col) TO the neighbor
  if (row > 0) neighbors.push({ r: row - 1, c: col, dirToNeighbor: 'N' }); // Neighbor is North
  if (col < gridWidth - 1) neighbors.push({ r: row, c: col + 1, dirToNeighbor: 'E' }); // Neighbor is East
  if (row < gridHeight - 1) neighbors.push({ r: row + 1, c: col, dirToNeighbor: 'S' }); // Neighbor is South
  if (col > 0) neighbors.push({ r: row, c: col - 1, dirToNeighbor: 'W' }); // Neighbor is West
  return neighbors;
}

/**
 * Get the opposite direction
 */
function getOppositeDirection(direction) {
  const opposites = { N: 'S', S: 'N', E: 'W', W: 'E' };
  return opposites[direction];
}

// Define socket compatibility. This is crucial.
// Format: { "socket_type_on_tile1": ["compatible_socket_type_on_tile2", ...] }
// These should reflect the connections allowed by your tile design.
const SOCKET_COMPATIBILITY_MAP = {
    "corridor_open_N": ["corridor_open_S", "room_entrance_S"],
    "corridor_open_S": ["corridor_open_N", "room_entrance_N"],
    "corridor_open_E": ["corridor_open_W", "room_entrance_W"],
    "corridor_open_W": ["corridor_open_E", "room_entrance_E"],

    "room_entrance_N": ["corridor_open_S"],
    "room_entrance_S": ["corridor_open_N"],
    "room_entrance_E": ["corridor_open_W"],
    "room_entrance_W": ["corridor_open_E"],

    // Assuming walls are boundaries or connect to specific opposite walls
    "wall_N": ["wall_S"],
    "wall_S": ["wall_N"],
    "wall_E": ["wall_W"],
    "wall_W": ["wall_E"],
    // Add any other specific socket types from your tile_catalog here
};


/**
 * Check if two tiles can connect.
 * tile1Name: Name of the first tile (e.g., the existing collapsed tile)
 * dirFrom1To2: Direction on tile1 pointing towards tile2 (e.g., 'N', 'S', 'E', 'W')
 * tile2Name: Name of the second tile (e.g., the option being considered for the neighbor)
 * tile_catalog: The catalog of all tile prototypes.
 */
function canConnect(tile1Name, dirFrom1To2, tile2Name, tile_catalog) {
  const tile1Proto = tile_catalog[tile1Name];
  const tile2Proto = tile_catalog[tile2Name];

  if (!tile1Proto || !tile2Proto) {
    // console.warn(`Tile prototype not found for ${tile1Name} or ${tile2Name}`);
    return false;
  }

  const socket1Type = tile1Proto.sockets[dirFrom1To2];
  const dirOnTile2 = getOppositeDirection(dirFrom1To2);
  const socket2Type = tile2Proto.sockets[dirOnTile2];

  if (!socket1Type || !socket2Type) {
    // console.warn(`Socket type not found for ${tile1Name}.${dirFrom1To2} or ${tile2Name}.${dirOnTile2}`);
    return false; // Socket doesn't exist for that side
  }

  const compatibleSockets = SOCKET_COMPATIBILITY_MAP[socket1Type];
  if (compatibleSockets && compatibleSockets.includes(socket2Type)) {
    return true;
  }

  return false;
}


/**
 * Run the WFC constraint propagation and collapse
 */
function runWFCPropagation(grid, initialToProcess, tile_catalog, roomChance, random) {
  const width = grid[0].length;
  const height = grid.length;
  let toProcess = [...initialToProcess]; // Use a copy

  // Helper to find tiles by base type from the catalog
  const tilesByType = groupTilesByType(tile_catalog);

  let iteration = 0;
  const maxIterations = width * height * Object.keys(tile_catalog).length; // Heuristic limit

  while (toProcess.length > 0 && iteration < maxIterations) {
    iteration++;
    // In a more standard WFC, you'd pick the cell with lowest entropy globally here.
    // This implementation processes a queue, which is a valid variant.
    const current = toProcess.shift();
    const { r: row, c: col, dirToNeighbor, fromTileName } = current; // dirToNeighbor is on fromTileName

    const cell = grid[row][col];
    if (cell.collapsed) {
      continue;
    }

    const originalOptionCount = cell.options.length;

    // Filter options for grid[row][col] based on fromTileName
    // dirToNeighbor is the socket on fromTileName.
    // The socket on the potential 'option' tile (at grid[row][col])
    // must be compatible with fromTileName's socket.
    const validOptions = cell.options.filter(optionTileName =>
      canConnect(fromTileName, dirToNeighbor, optionTileName, tile_catalog)
    );

    if (validOptions.length === 0) {
      // CONTRADICTION: No valid options for this cell based on the neighbor.
      // This is a critical issue. For a robust solution, backtracking would be needed.
      // For now, we'll mark it as having no options and it will be handled later.
      grid[row][col].options = [];
      // console.warn(`Contradiction at [${row},${col}]. No valid options.`);
      // Optionally, you could stop WFC here or implement backtracking.
      continue; // Skip trying to collapse this cell for now.
    }

    grid[row][col].options = validOptions;

    // If options significantly reduced, or by chance, or only one option left
    if (validOptions.length < originalOptionCount || validOptions.length === 1 ) {
        // If only one option, collapse to it
        if (validOptions.length === 1 || random() < 0.25 ) { // Increased chance to collapse if options reduced
            let selectedTileName;

            // Try to pick based on roomChance, but only from valid options
            const potentialRoomTiles = [
                ...(tilesByType.room_medium_corner_entrances || []),
                ...(tilesByType.room_small_single_entrance || [])
            ].filter(tName => validOptions.includes(tName));

            if (random() < roomChance && potentialRoomTiles.length > 0) {
                selectedTileName = potentialRoomTiles[Math.floor(random() * potentialRoomTiles.length)];
            } else {
                // Filter out rooms if not selected by roomChance, or pick any valid if rooms failed
                let nonRoomOptions = validOptions.filter(tName => {
                    const base = tile_catalog[tName]?.baseType;
                    return !base?.startsWith("room_");
                });
                if(nonRoomOptions.length === 0 && validOptions.length > 0) nonRoomOptions = validOptions; // fallback if only rooms are valid

                if (nonRoomOptions.length > 0) {
                    selectedTileName = nonRoomOptions[Math.floor(random() * nonRoomOptions.length)];
                } else if (validOptions.length > 0) { // Should not happen if nonRoomOptions fallback works
                     selectedTileName = validOptions[Math.floor(random() * validOptions.length)];
                } else {
                    // This case means validOptions was empty after all, which should have been caught
                    // console.error(`Error: No tile could be selected for [${row}, ${col}] despite having options earlier.`);
                    grid[row][col].options = []; // Mark as contradiction
                    continue;
                }
            }
            
            if (!selectedTileName) { // Should ideally not happen if validOptions.length > 0
                // This cell is problematic.
                grid[row][col].options = []; // Mark as contradiction
                // console.warn(`Could not select a tile for [${row}, ${col}] from ${validOptions.length} valid options.`);
                continue;
            }

            grid[row][col] = {
                collapsed: true,
                options: [selectedTileName],
                tile: selectedTileName,
            };

            // Add its neighbors to the processing queue
            const neighborsOfCollapsed = getNeighbors(row, col, width, height);
            for (const neighbor of neighborsOfCollapsed) {
                if (!grid[neighbor.r][neighbor.c].collapsed) {
                    toProcess.push({
                        r: neighbor.r,
                        c: neighbor.c,
                        dirToNeighbor: neighbor.dirToNeighbor, // Direction from current cell to this neighbor
                        fromTileName: selectedTileName,
                    });
                }
            }
        }
    }
     // Re-sort toProcess to prioritize cells with fewer options (simple entropy heuristic)
     toProcess.sort((a, b) => grid[a.r][a.c].options.length - grid[b.r][b.c].options.length);
  }

  if (iteration >= maxIterations) {
    console.warn("WFC reached max iterations. Dungeon might be incomplete.");
  }

  // Final pass: Collapse any remaining uncollapsed cells
  // This part needs to be careful about cells with NO valid options left.
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (!grid[r][c].collapsed) {
        const cell = grid[r][c];
        if (cell.options.length > 0) {
          // Collapse to a random valid option. Could be smarter (e.g. lowest entropy globally)
          // For simplicity, pick a random one from remaining options.
          // Biasing towards simpler tiles like corridors for unforced cells might be good.
          let chosenTile = cell.options[Math.floor(random() * cell.options.length)];
          grid[r][c] = {
            collapsed: true,
            options: [chosenTile],
            tile: chosenTile,
          };
        } else {
          // This cell had a contradiction and no valid options remained.
          // Mark it as an error or unfillable.
          // console.warn(`Cell [${r},${c}] could not be collapsed (no valid options). Marking as ERROR_TILE.`);
          grid[r][c] = {
            collapsed: true,
            options: [],
            tile: "ERROR_TILE_NO_OPTIONS", // Special marker
          };
        }
      }
    }
  }
}


/**
 * Expand the WFC grid (grid of tile names) to a full cell-based grid.
 */
function expandToFullGrid(wfcGrid, tile_catalog, chunkSize) {
  if (!wfcGrid || wfcGrid.length === 0) return [];
  const chunkRows = wfcGrid.length;
  const chunkCols = wfcGrid[0].length;

  // Determine max dimensions based on tile sizes if they are larger than chunkSize
  // This is tricky. For now, we assume chunkSize defines the cell grid size per WFC cell.
  const fullHeight = chunkRows * chunkSize;
  const fullWidth = chunkCols * chunkSize;

  const finalCellGrid = Array.from({ length: fullHeight }, () =>
    Array(fullWidth).fill(1) // Default to wall (1 means wall, 0 means floor)
  );

  for (let cr = 0; cr < chunkRows; cr++) {
    for (let cc = 0; cc < chunkCols; cc++) {
      const wfcCell = wfcGrid[cr][cc];
      const tileName = wfcCell.tile;

      if (tileName && tileName !== "ERROR_TILE_NO_OPTIONS" && tile_catalog[tileName]) {
        const tileProto = tile_catalog[tileName];
        const layout = tileProto.layout;
        const tileLayoutHeight = tileProto.height; // Use actual tile height from prototype
        const tileLayoutWidth = tileProto.width;   // Use actual tile width from prototype

        if (!layout || !tileLayoutHeight || !tileLayoutWidth) {
        //   console.warn(`Tile ${tileName} has no layout or dimensions. Skipping.`);
          continue;
        }

        const startRow = cr * chunkSize;
        const startCol = cc * chunkSize;

        for (let r_offset = 0; r_offset < tileLayoutHeight; r_offset++) {
          for (let c_offset = 0; c_offset < tileLayoutWidth; c_offset++) {
            const finalRow = startRow + r_offset;
            const finalCol = startCol + c_offset;

            if (finalRow < fullHeight && finalCol < fullWidth) {
              if (layout[r_offset] && typeof layout[r_offset][c_offset] !== 'undefined') {
                finalCellGrid[finalRow][finalCol] = layout[r_offset][c_offset];
              }
            }
          }
        }
      } else if (tileName === "ERROR_TILE_NO_OPTIONS") {
        // Area for ERROR_TILE can be left as default wall, or explicitly made empty,
        // or filled with a special pattern. For now, it defaults to wall.
        const startRow = cr * chunkSize;
        const startCol = cc * chunkSize;
        for (let r_offset = 0; r_offset < chunkSize; r_offset++) {
          for (let c_offset = 0; c_offset < chunkSize; c_offset++) {
            const finalRow = startRow + r_offset;
            const finalCol = startCol + c_offset;
            if (finalRow < fullHeight && finalCol < fullWidth) {
            //   finalCellGrid[finalRow][finalCol] = 0; // Example: make error cells empty
            }
          }
        }
      }
    }
  }
  return finalCellGrid;
}


/**
 * Main function to generate dungeon with WFC
 */
function generateDungeonWithWFC({
  tile_catalog,
  width = 27, // Width of the WFC grid in chunks/tile-slots
  height = 27, // Height of the WFC grid in chunks/tile-slots
  chunkSize = 3, // Assumed size of one "cell" in the final grid for layout stamping
  roomChance = 0.1,
  seed = null // Allow null to use Date.now()
}) {
  if (!tile_catalog || Object.keys(tile_catalog).length === 0) {
    throw new Error('Tile catalog is required and cannot be empty for WFC algorithm');
  }

  const actualSeed = seed !== null ? seed : Date.now();
  const random = createRandomFunction(actualSeed);

  const allTileNames = Object.keys(tile_catalog);
  const wfcGrid = initializeGrid(width, height, allTileNames);
  const tilesByType = groupTilesByType(tile_catalog); // For biased selection

  const centerRow = Math.floor(height / 2);
  const centerCol = Math.floor(width / 2);

  // Select initial tile (crossroads or a common corridor piece are good starts)
  let initialTileName;
  if (tilesByType.corridor_cross && tilesByType.corridor_cross.length > 0) {
    initialTileName = tilesByType.corridor_cross[Math.floor(random() * tilesByType.corridor_cross.length)];
  } else if (tilesByType.corridor_straight && tilesByType.corridor_straight.length > 0) {
    initialTileName = tilesByType.corridor_straight[Math.floor(random() * tilesByType.corridor_straight.length)];
  } else {
    initialTileName = allTileNames[Math.floor(random() * allTileNames.length)]; // Fallback
  }
  
  wfcGrid[centerRow][centerCol] = {
    collapsed: true,
    options: [initialTileName],
    tile: initialTileName,
  };

  // Initial items to process: neighbors of the center tile
  const initialToProcess = [];
  const neighborsOfStart = getNeighbors(centerRow, centerCol, width, height);
  for (const neighbor of neighborsOfStart) {
    initialToProcess.push({
        r: neighbor.r, // row of the neighbor
        c: neighbor.c, // col of the neighbor
        dirToNeighbor: neighbor.dirToNeighbor, // Direction from center cell to this neighbor
        fromTileName: initialTileName, // The tile in the center cell
    });
  }

  runWFCPropagation(wfcGrid, initialToProcess, tile_catalog, roomChance, random);

  return expandToFullGrid(wfcGrid, tile_catalog, chunkSize);
}

export { generateDungeonWithWFC };