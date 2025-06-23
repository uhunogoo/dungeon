'use client'

import React from 'react';
import Bounds from '@/components/Bounds/Bounds';
import Button from '@/components/Button/Button';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

function Level1({}) {
  return (
    <group>
      <Platform position={[ 0, -0.05, 0]}/>
      <Platform position={[ 1, -0.05, 0]}/>
      <Bounds
        args={[ 63.38 * 0.5, 0.1, 17.62 ]}
        position={[ 0, -0.05, 0 ]}
      />
      <Button />
      <RigidBody type="fixed" colliders="trimesh" position={ [ 0, 0, 0 ] } restitution={ 0.2 } friction={ 0 }>
        <LevelMap />
        {/* <primitive object={ scene } /> */}
      </RigidBody>
    </group>
  )
}

function LevelMap() {
  const { nodes } = useGLTF('/assets/game-level.glb');
  const [ material, setMaterial ] = React.useState( null ); 
  return (
    <>
      <meshStandardNodeMaterial ref={ setMaterial } color="white" />
      <group>
        <mesh
          geometry={ nodes.outline_wall.geometry }
          material={ material } 
        />
        <mesh 
          geometry={ nodes.wall_14.geometry }
          material={ material}
        />
        <mesh 
          geometry={ nodes.wall_28.geometry }
          material={ material}
        />
        <mesh 
          geometry={ nodes.wall_42.geometry }
          material={ material}
        />
      </group>
    </>
  )
}

function Platform({ ...delegated }) {
  return (
    <mesh {...delegated}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardNodeMaterial color="lightblue" />
    </mesh>
  );
}


useGLTF.preload('/assets/game-level.glb');

export default Level1;