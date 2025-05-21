'use client';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import React from 'react';
// import * as THREE from 'three';

function Corridor({ from, to }) {

  return (
    <Line 
      points={[ [ from.x, 0, from.y ], [ to.x, 0, to.y ] ]}
      color="white"
      lineWidth={2}
      dashed={false}
      segments={ 4 }
      scale={[ 1, 1, 1 ]}
      material={ new THREE.LineBasicMaterial( { color: 0xffffff } ) }
    />
  )
}

export default Corridor;