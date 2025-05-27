import React from 'react';
import { RoomAngle, RoomBig, RoomStandart, RoomStraight } from '../Room/Room';
import useMazeGenerator from '@/hooks/useMazeGenerator';
// import * as ROT from 'rot-js';
// import { range } from '@/lib/utils';

const ROWS = 81;
const COLS = 81;

const COLORS = {
  FLOOR: 'gray',
  WALL: 'darkgray',
  DOOR: 'brown',
  ROOM_HIGHLIGHT: 'blue', // For debugging or highlighting
};

const templates = [
  {
    name: 'RoomStandart',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'N', localPosition: [ 0, 0.5, -2.5 ] },
      { direction: 'S', localPosition: [ 0, 0.5, 2.5 ] },
      { direction: 'E', localPosition: [ 2.5, 0.5, 0 ] },
      { direction: 'W', localPosition: [ -2.5, 0.5, 0 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomStandart />,
  },
  {
    name: 'RoomStraight_NS',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'N', localPosition: [ 0, 0.5, -2.5 ] },
      { direction: 'S', localPosition: [ 0, 0.5, 2.5 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomStraight />,
  },
  {
    name: 'RoomStraight_EW',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'E', localPosition: [ 2.5, 0.5, 0 ] },
      { direction: 'W', localPosition: [ -2.5, 0.5, 0 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomStraight rotation-y={ Math.PI * 0.5 } />,
  },
  {
    name: 'RoomAngle_NE',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'N', localPosition: [ 0, 0.5, -2.5 ] },
      { direction: 'E', localPosition: [ 2.5, 0.5, 0 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomAngle />,
  },
  {
    name: 'RoomAngle_NW',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'N', localPosition: [ 0, 0.5, -2.5 ] },
      { direction: 'W', localPosition: [ -2.5, 0.5, 0 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomAngle rotation-y={ Math.PI / 2 } />,
  },
  {
    name: 'RoomAngle_SW',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'S', localPosition: [ 0, 0.5, 2.5 ] },
      { direction: 'W', localPosition: [ -2.5, 0.5, 0 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomAngle rotation-y={ Math.PI } />,
  },
  {
    name: 'RoomAngle_SE',
    sizes: [ 5, 1, 5 ],
    doors: [
      { direction: 'S', localPosition: [ 0, 0.5, 2.5 ] },
      { direction: 'E', localPosition: [ 2.5, 0.5, 0 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomAngle rotation-y={ Math.PI * 1.5 } />,
  },
  {
    name: 'RoomBig',
    sizes: [ 15, 1, 10 ],
    doors: [
      { direction: 'N', localPosition: [ 0, 0.5, -7.5 ] },
    ],
    position: [ 0, 0, 0 ],
    component: <RoomBig />,
  },
];

function Level2() {
  const dungeon = useMazeGenerator( templates, 20 );

  return (
    <group>
      { dungeon.map( ( room ) => {
        return <group key={ room.id } position={ room.position }>
          { room.room.component }
        </group>
      }) }
    </group>
  )
}

export default Level2;