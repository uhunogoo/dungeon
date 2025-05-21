function rotateSockets(sockets, times = 1) {
  const dirs = ['N', 'E', 'S', 'W'];
  const rotated = {};

  for (const [dir, socket] of Object.entries(sockets)) {
    const index = dirs.indexOf(dir);
    const newDir = dirs[(index + times) % 4];
    
    // якщо маєш напрямлені сокети типу "corridor_open_N"
    const socketTypeParts = socket.split('_');
    if (socketTypeParts.length === 2 && dirs.includes(socketTypeParts[1])) {
      const base = socketTypeParts[0]; // corridor_open
      const dirIndex = dirs.indexOf(socketTypeParts[1]);
      const newSocketDir = dirs[(dirIndex + times) % 4];
      rotated[newDir] = `${base}_${newSocketDir}`;
    } else {
      // fallback для простих сокетів
      rotated[newDir] = socket;
    }
  }

  return rotated;
}

// Function to rotate a layout matrix (90 degrees clockwise)
const rotateLayout = (layout) => {
  const size = layout.length;
  const rotated = Array(size).fill().map(() => Array(size).fill(0));
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = layout[y][x];
    }
  }
  
  return rotated;
};


// Generate the complete tile catalog with all rotations
export function generateTileCatalog( tile_prototypes = {} ) {
  const catalog = {};
  
  // Process each prototype
  Object.values(tile_prototypes).forEach(prototype => {
    // Generate rotational variants
    for (let rotation = 0; rotation < prototype.rotations; rotation++) {
      // Skip redundant rotations for symmetrical tiles
      if (prototype.rotations === 1 && rotation > 0) continue;
      
      // Determine the rotation direction names
      const directions = ['N', 'E', 'S', 'W'];
      const startDir = rotation === 0 ? '' : directions[rotation % 4];
      
      // Create the rotated tile name
      const tileName = rotation === 0 
        ? prototype.name 
        : `${prototype.name}_${startDir}`;
      
      // Rotate the sockets
      const rotatedSockets = rotateSockets({ ...prototype.sockets }, rotation);
      
      // Rotate the layout matrix
      let rotatedLayout = [...prototype.layout.map(row => [...row])];
      for (let i = 0; i < rotation; i++) {
        rotatedLayout = rotateLayout(rotatedLayout);
      }
      
      // Create the tile entry
      catalog[tileName] = {
        name: tileName,
        width: prototype.width,
        height: prototype.height,
        sockets: rotatedSockets,
        layout: rotatedLayout,
        baseType: prototype.name,
        rotation: rotation * 90 // store rotation in degrees
      };
    }
  });
  
  return catalog;
}