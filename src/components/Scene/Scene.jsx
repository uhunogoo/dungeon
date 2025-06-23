'use client'

import * as THREE from 'three/webgpu';

import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Canvas, extend } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { Suspense } from 'react';
import Player from '@/components/Player/Player';

extend( THREE );

function Scene({ children }) {
  const map = React.useMemo(() => [
    { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
    { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
    { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
    { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
    { name: 'jump', keys: [ 'Space' ] }
  ], []);
  return (
    <KeyboardControls map={ map }>
      <Canvas
        style={{ position: 'fixed', top: 0, left: 0, height: "100vh", width: "100vw" }}
        camera={{ position: [-6, 6, 6], fov: 75 }}
        gl={(props) => {
          const renderer = new THREE.WebGPURenderer(props)
          return renderer.init().then(() => renderer)
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <Physics debug={ true } gravity={[0, -9.81, 0]}>
            <Player />
            { children }
          </Physics>
        </Suspense>

        <OrbitControls makeDefault />

      </Canvas>
    </KeyboardControls>
  )
}

export default Scene;