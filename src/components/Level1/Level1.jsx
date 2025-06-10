'use client'

import React from 'react';

// import { buildMSTFromEdges, delaunayEdges, generatePartitionedRooms } from '@/lib/utils';
// import RoomStandart from '../Room/Room';
// import Corridor from '../Corridor/Corridor';

const GRID_SIZE = 80;
const ROWS = 6;
const COLS = 6;

function Level1({}) {
  const { rooms, edges } = React.useMemo(() => {
    const rooms = generatePartitionedRooms( GRID_SIZE, ROWS, COLS );
    const delaunayEdgesResult = delaunayEdges( rooms );
    const mstEdges = buildMSTFromEdges( rooms, delaunayEdgesResult );
    return {
      rooms,
      edges: mstEdges
    }
  }, []);

  return (
    <group position={[ -GRID_SIZE / 2, 0, -GRID_SIZE / 2 ]}>
      {rooms?.map((room, i) => (
        <RoomStandart key={i} { ...room } />
      ))}
      {edges?.map((edge, i) => (
        <Corridor key={i} from={edge[0]} to={edge[1]} />
      ))}
    </group>
  )
}

export default Level1;