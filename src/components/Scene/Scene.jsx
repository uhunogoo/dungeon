'use client'

import * as THREE from 'three/webgpu';

import { OrbitControls } from '@react-three/drei';
import { Canvas, extend } from '@react-three/fiber';

function Scene({ children }) {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, height: "100vh", width: "100vw" }}
      camera={{ position: [0, 60, 0], fov: 75 }}
      // gl={(props) => {
      //   extend(THREE)
      //   const renderer = new THREE.WebGPURenderer(props)
      //   return renderer.init().then(() => renderer)
      // }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      { children }

      <OrbitControls makeDefault />

    </Canvas>
  )
}

export default Scene;