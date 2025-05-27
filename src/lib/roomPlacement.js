export function setRoomPosition( enterDoor = 'S', sizes = [1, 1, 1] ) {
  const currentDirection = getOppositeDirection( enterDoor );
  const currentPosition = getDoorOffset( currentDirection, sizes );

  return currentPosition;
}

export function getOppositeDirection( direction ) {
  switch (direction) {
    case "N": return "S";
    case "S": return "N";
    case "E": return "W";
    case "W": return "E";
    default: return null;
  }
}

export function getDoorOffset( direction, sizes ) {
  const [ w, h, d ] = sizes;

  switch (direction) {
    case "N": return [ 0, h / 2, d / 2 ];
    case "S": return [ 0, h / 2, -d / 2 ];
    case "E": return [ -w / 2, h / 2, 0 ];
    case "W": return [ w / 2, h / 2, 0 ];
    default: return [0, 0, 0];
  }
}

export function buildDungeon( doors = [], templates = [], rooms = 1 ) {
  const dungeon = [];
  
  for ( let i = 0; i < rooms; i++ ) {
    // const room = placeRoom(doors, templates);
    // dungeon.push(room);
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 50) {
      const [ door, room] = placeRoom(doors, templates);

      if (!room) break;

      const collides = dungeon.some(existing => isColliding(existing, room));
      if (!collides) {
        dungeon.push(room);
        addDoorsToTheList( doors, room, door.direction );
        placed = true;
      }

      attempts++;
    }
  }

  return dungeon;
}

export function placeRoom( doors = [], templates = [] ) {
  const randomDoor = getRandomDoor( doors );
  if (!randomDoor) return null;

  const randomTemplate = getRandomTemplate( templates, randomDoor.direction );
  if (!randomTemplate) return null;

  const roomOffset = setRoomPosition( randomDoor.direction, randomTemplate.sizes );
  const roomPosition = addVectors( randomDoor.localPosition, roomOffset );

  const newRoom = {
    id: randomTemplate.name + '_' + randomDoor.direction + '_' + randomID( 1000 ),
    room: randomTemplate,
    position: roomPosition,
  }
  
  return [ randomDoor, newRoom ];
}

function addDoorsToTheList( doors = [], tmplate = {}, direction = 'N' ) {
  const { room } = tmplate;

  if ( !room.doors || room.doors.length === 0 ) return doors;
  const usedDirection = getOppositeDirection( direction );
  room.doors.forEach( ( door ) => {
    if ( door.direction !== usedDirection ) {
      const doorPosition = addVectors( door.localPosition, tmplate.position );
  
      const newDoor = {
        direction: door.direction,
        localPosition: doorPosition,
        isUsed: false,
      };
  
      doors.push( newDoor );
    }
  });
}

function getRandomTemplate( templates = [], direction = 'N' ) {
  if (templates.length === 0) return null;
  const oppositeDoor = getOppositeDirection(direction);
  const filteredTemplates = templates.filter(template =>
    template.doors.some(door => door.direction === oppositeDoor)
  );

  if (filteredTemplates.length === 0) return null;

  const randomIndex = randomID(filteredTemplates.length);
  return filteredTemplates[randomIndex];
  // if ( templates.length === 0 ) return null;
  // const oppositeDoor = getOppositeDirection( direction );
  // const filteredTemplates = templates.filter( template => 
  //   template.doors.some( door => door.direction === oppositeDoor )
  // );
  // const randomIndex = randomID( templates.length );


  // // return templates[ randomIndex ];
  // return filteredTemplates.length > 0 ? filteredTemplates[ randomIndex % filteredTemplates.length ] : null;
}

function getRandomDoor( doors = [] ) {
  const unusedDoors = doors.filter(door => !door.isUsed);
  if (unusedDoors.length === 0) {
    return null;
  }
  const randomDoorIndex = randomID(unusedDoors.length);
  const door = unusedDoors[randomDoorIndex];
  door.isUsed = true; // Модифікуємо об'єкт напряму
  return door;

  // const randomDoorIndex = randomID( doors.length );
  // const door = doors[ randomDoorIndex ];

  // if (door.isUsed ) {
  //   return getRandomDoor( doors );
  // }
  // door.isUsed = true;
  
  // return door; 
}

function isColliding(roomA, roomB) {
  const [xA, , zA] = roomA.position;
  const [wA, , dA] = roomA.room.sizes;
  const [xB, , zB] = roomB.position;
  const [wB, , dB] = roomB.room.sizes;

  const halfWA = wA / 2, halfDA = dA / 2;
  const halfWB = wB / 2, halfDB = dB / 2;

  return !(
    xA + halfWA <= xB - halfWB || // A праворуч від B
    xA - halfWA >= xB + halfWB || // A ліворуч від B
    zA + halfDA <= zB - halfDB || // A знизу від B
    zA - halfDA >= zB + halfDB    // A зверху від B
  );
}

function addVectors(vec1, vec2) {
  return [vec1[0] + vec2[0], vec1[1], vec1[2] + vec2[2]];
}

function randomID( length = 0 ) {
  return Math.floor( Math.random() * length );
} 