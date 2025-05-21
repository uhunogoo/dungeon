import React from 'react';
import * as ROT from 'rot-js';

const ROWS = 81;
const COLS = 81;

const COLORS = {
  FLOOR: 'gray',
  WALL: 'darkgray',
  DOOR: 'brown',
  ROOM_HIGHLIGHT: 'blue', // For debugging or highlighting
};

function Level2() {
  const dungeon = React.useMemo(() => {
    const grid = Array.from({ length: ROWS }, () => Array( COLS ).fill( 1 )); // 0 = empty space, 1 = wall
    generateDungeon( grid, COLS, ROWS );
    return grid;
  }, []);

  return (
    <group position={[-COLS / 2, 0, -ROWS / 2]}>
    { dungeon.map((row, rowIndex) => (
      row.map((cell, colIndex) => (
        (cell !== 1 ) ? ( 
        <mesh key={`${rowIndex}-${colIndex}`} position={[colIndex, 0, rowIndex]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={ COLORS.FLOOR } />
        </mesh>
        ) : null
      ))
    )) }
    </group>
  )
}

function Room({ x, y, width, height, roomColor }) {
  return (
    <>
      {/* Render the floor of the room */}
      <mesh position={[x + width / 2 - 0.5, -0.5, y + height / 2 - 0.5]}> {/* Adjust position to center the floor */}
        <boxGeometry args={[width, 0.1, height]} />
        <meshBasicMaterial color={roomColor || COLORS.FLOOR} />
      </mesh>

      {/* Render the walls of the room (simplified for now) */}
      {/* You'd typically want to create individual wall segments for more detail */}
      {/* Top Wall */}
      <mesh position={[x + width / 2 - 0.5, 0, y - 0.5]}>
        <boxGeometry args={[width, 1, 0.1]} />
        <meshBasicMaterial color={COLORS.WALL} />
      </mesh>
      {/* Bottom Wall */}
      <mesh position={[x + width / 2 - 0.5, 0, y + height - 0.5]}>
        <boxGeometry args={[width, 1, 0.1]} />
        <meshBasicMaterial color={COLORS.WALL} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[x - 0.5, 0, y + height / 2 - 0.5]}>
        <boxGeometry args={[0.1, 1, height]} />
        <meshBasicMaterial color={COLORS.WALL} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[x + width - 0.5, 0, y + height / 2 - 0.5]}>
        <boxGeometry args={[0.1, 1, height]} />
        <meshBasicMaterial color={COLORS.WALL} />
      </mesh>
    </>
  );
}

function Corridor({ x1, y1, x2, y2, wallEnd }) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1);

  return (
    <mesh position={[ (x1 + x2) / 2, 0, (y1 + y2) / 2 ]} rotation={[0, angle, 0]}>
      <boxGeometry args={[length, 1, 0.5]} />
      <meshBasicMaterial color={COLORS.WALL} />
    </mesh>
  );
}

function generateDungeon( grid, COLS = 10, ROWS = 10, ) {
  // seed random
  ROT.RNG.setSeed( 1234 );

  // collected data
  const roomsData = [];
  const corridorsData = [];
  
  const map = new ROT.Map.Digger(COLS, ROWS, {
    roomWidth: [ 5, 10 ],
    roomHeight: [ 5, 10 ],
    corridorLength: [ 5, 10 ],
    dugPercentage: 0.2,
  });
  map.create((x, y, value) => {
    if (value === 0) {
      grid[y][x] = 0; // 0 - floor
    }
  });

  const rooms = map.getRooms();
  for (let i=0; i<rooms.length; i++) {
    let room = rooms[i];
    const doors = [];

    roomsData.push({
      x: room.getLeft(),
      y: room.getTop(),
      width: room.getRight() - room.getLeft() + 1,
      height: room.getBottom() - room.getTop() + 1,
      doors: doors,
    });
    
    room.getDoors( (x, y) => {
      grid[y][x] = 2; // 2 = door
      doors.push([ x, y ]);
    } );
  }

  const corridors = map.getCorridors();
  for ( let corridor of corridors ) {
    corridorsData.push({
      x1: corridor._startX,
      y1: corridor._startY,
      x2: corridor._endX,
      y2: corridor._endY,
      wallEnd: corridor._endsWithAWall
    });
  }
    
  return { 
    rooms: roomsData, 
    corridors: corridorsData, 
    grid 
  };
}

export default Level2;