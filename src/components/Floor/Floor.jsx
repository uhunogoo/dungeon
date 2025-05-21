'use client'

import React from 'react';

import { Clone, useGLTF } from '@react-three/drei';

export function Floor({ ...delegated }) {
  const { nodes } = useGLTF("/assets/models/floor/floor.glb");
  
  return (
    <>
      <Clone
        object={nodes["floor"]}
        position={[-2, -0.5, 0]}
        { ...delegated }
      />
    </>
  )
}
export function FloorDetail({ ...delegated }) {
  const { nodes } = useGLTF("/assets/models/floor/floor-detail.glb");
  
  return (
    <>
      <Clone
        object={ nodes["floor-detail"] }
        position={[-2, -0.5, 0]}
        { ...delegated }
      />
    </>
  )
}

useGLTF.preload( "/assets/models/floor/floor.glb" );
useGLTF.preload( "/assets/models/floor/floor-detail.glb" );