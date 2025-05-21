'use client'

import React from 'react';

import { Clone, useGLTF } from '@react-three/drei';

export function Wall({ ...delegated }) {
  const { nodes, materials } = useGLTF("/assets/models/walls/wall.glb");
  
  return (
    <>
      <Clone
        object={nodes.wall}
        // object={nodes.wall}
        // material={materials?.colormap}
        position={[-2, -0.5, 0]}
        { ...delegated }
      />
    </>
  )
}
export function WallHalf({ ...delegated }) {
  const { nodes, materials } = useGLTF("/assets/models/walls/wall-half.glb");
  
  return (
    <>
      <Clone
        object={ nodes["wall-half"] }
        material={ materials?.colormap }
        position={[-2, -0.5, 0]}
        { ...delegated }
      />
    </>
  )
}

export function WallNarrow({ ...delegated }) {
  const { nodes, materials } = useGLTF("/assets/models/walls/wall-narrow.glb");
  
  return (
    <>
      <Clone
        object={ nodes["wall-narrow"] }
        material={ materials?.colormap }
        position={[-2, -0.5, 0]}
        { ...delegated }
      />
    </>
  )
}
export function WallOpening({ ...delegated }) {
  const { nodes, materials } = useGLTF("/assets/models/walls/wall-opening.glb");
  
  return (
    <>
      <Clone
        object={ nodes["wall-opening"] }
        material={ materials?.colormap }
        position={[-2, -0.5, 0]}
        { ...delegated }
      />
    </>
  )
}

useGLTF.preload( "/assets/models/walls/wall.glb" );
useGLTF.preload( "/assets/models/walls/wall-half.glb" );
useGLTF.preload( "/assets/models/walls/wall-narrow.glb" );
useGLTF.preload( "/assets/models/walls/wall-opening.glb" );