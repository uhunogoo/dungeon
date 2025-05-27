import React from 'react';
import { RoomStandart } from '../Room/Room';

export default function useRoomAlign( enterDoor = '', sizes = [] ) {
  const roomData = React.useCallback( () => {
    const currentDirection = getOppositeDirection( enterDoor );
    const currentPosition = getDoorOffset( currentDirection, sizes );

    return {
      position: currentPosition,
      sizes
    }
  }, [ enterDoor, sizes ]);
  return null;
}

function getOppositeDirection( direction ) {
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
    case "N": return [ 0, h / 2, -d / 2 ];
    case "S": return [ 0, h / 2, d / 2 ];
    case "E": return [ w / 2, h / 2, 0 ];
    case "W": return [ -w / 2, h / 2, 0 ];
    default: return [0, 0, 0];
  }
}