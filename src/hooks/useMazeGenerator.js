import { buildDungeon, placeRoom } from '@/lib/roomPlacement';
import React from 'react';

// Room template example
// {
//   name: 'RoomStandart',
//   sizes: [ 5, 1, 5 ],
//   doors: [
//     { direction: 'N', isUsed: false, localPosition: [ 0, 0.5, -2.5 ] },
//     { direction: 'S', isUsed: false, localPosition: [ 0, 0.5, 2.5 ] },
//     { direction: 'E', isUsed: false, localPosition: [ 2.5, 0.5, 0 ] },
//     { direction: 'W', isUsed: false, localPosition: [ -2.5, 0.5, 0 ] },
//   ],
//   position: [ 0, 0, 0 ],
//   component: <RoomStandart />,
// }

function useMazeGenerator( templates = {}, rooms = 1 ) {
  // const [ maze, setMaze ] = React.useState([]);
  const maze = React.useMemo(() => {
    if ( !templates ) return [];
    
    const doors = [];

    const startRoom = templates[0];
    startRoom.doors.forEach(( door ) => 
      doors.push({
        direction: door.direction,
        localPosition: door.localPosition,
        isUsed: false,   
      })
    );

    const dungeon = buildDungeon( doors, templates, rooms - 1 );
    console.log('dungeon', dungeon );
    
    return [ { 
      id: 'start',
      room: startRoom,
      position: [ 0, 0.5, 0 ] 
    }, ...dungeon];
  }, [ templates, rooms ]);

  return maze;
}

export default useMazeGenerator;