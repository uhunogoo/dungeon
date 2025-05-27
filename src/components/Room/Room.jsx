import React from 'react';

export function RoomStandart() {
  return (
    <group>
      <mesh scale={[ 4.5, 1, 4.5 ]}>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>
      <mesh scale={[ 4.5, 1, 0.5 ]} position-y={1}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh scale={[ 0.5, 1, 4.5 ]} position-y={1}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}
export function RoomBig() {
  return (
    <group>
      <mesh scale={[ 14.5, 1, 9.5 ]}>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>

      <mesh scale={[ 0.5, 1, 4.5 ]}  position={[ 0, 1, -4.25 ]}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}

export function RoomStraight({ ...props }) {
  return (
    <group { ...props }>
      <mesh scale={[ 4.5, 1, 4.5 ]}>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>

      <mesh scale={[ 0.5, 1, 4.5 ]} position-y={1}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}

export function RoomAngle({ ...props }) {
  return (
    <group {...props}>
      <mesh scale={[ 4.5, 1, 4.5 ]}>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>

      <mesh scale={[ 0.5, 1, 2.25 ]} position={[ 0, 1, -1.125 ]}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
      
      <mesh scale={[ 2.25, 1, 0.5 ]} position={[ 1.125, 1, 0 ]}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>

    </group>
  );
}
