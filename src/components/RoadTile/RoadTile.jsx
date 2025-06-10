import { range } from '@/lib/utils';
import { Merged } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
const box = new THREE.BoxGeometry( 1, 1, 1 );
const grey = new THREE.MeshBasicMaterial( { color: 0x808080 } );

THREE.ColorManagement.enabled = true
THREE.ColorManagement.legacyMode = false

export function RoadTileStandart() {
  return (
    <group>
      <mesh 
        geometry={ box } 
        material={ grey }
        scale={[ 0.2, 0.1, 0.2 ]} 
        position={[ -0.25, 0.05, -0.25 ]} 
      />
      <mesh 
        geometry={ box } 
        material={ grey }
        scale={[ 0.2, 0.1, 0.2 ]} 
        position={[ 0.25, 0.05, -0.25 ]} 
      />
      <mesh 
        geometry={ box } 
        material={ grey }
        scale={[ 0.2, 0.1, 0.2 ]} 
        position={[ 0.25, 0.05, 0.25 ]} 
      />
      <mesh 
        geometry={ box } 
        material={ grey }
        scale={[ 0.2, 0.1, 0.2 ]} 
        position={[ -0.25, 0.05, 0.25 ]} 
      />
    </group>
  )
}

export function RoadTreeTile({ tiles }) {
  const brickRoad = React.useMemo(() => {
    const batchedMesh = new THREE.BatchedMesh( 10, 5000, 10000, grey );
    const boxMatrix = new THREE.Matrix4();
    
    range( 3 ).forEach( tile => {
      const boxGeometryId = batchedMesh.addGeometry( box );
      const boxInstancedId1 = batchedMesh.addInstance( boxGeometryId );
      const boxMatrix1 = boxMatrix.makeTranslation( tile - 1, 0.05, -1 );
      batchedMesh.setMatrixAt( boxInstancedId1, boxMatrix1 );
    });
    console.log( batchedMesh.geometry );
    return batchedMesh.geometry;
  }, []);

  console.log( tiles );

  return (
    <group>
        {/* <mesh 
          geometry={ box } 
          material={ grey }
          scale={[ 0.2, 0.1, 0.2 ]} 
          position={[ -0.25, 0.05, -0.25 ]} 
        />
        <mesh 
          geometry={ box } 
          material={ grey }
          scale={[ 0.2, 0.1, 0.2 ]} 
          position={[ 0.25, 0.05, -0.25 ]} 
        />
        <mesh 
          geometry={ box } 
          material={ grey }
          scale={[ 0.2, 0.1, 0.2 ]} 
          position={[ 0.25, 0.05, 0.25 ]} 
        /> */}
    </group>
  )
}

// const map = React.useMemo(() => {
//     const grass = data.find(layer => layer.name === 'grass');
//     return grass ? grass : { data: [], width: 0, height: 0 };
//   }, [data]);

//   const positions = React.useMemo(() => {
//     const tiles = [];
//     map.data.forEach((tile, index) => {
//       if (tile === 1) return; // Пропускаємо пусті
//       const x = (index % map.width) - map.width / 2;
//       const z = Math.floor(index / map.width) - map.height / 2;
//       tiles.push([x, 0.5, z]);
//     });
//     return tiles;
//   }, [map]);

//   return (
//     <group>
//       <mesh scale={[map.width, 1, map.height]} position={[0, -0.5, 0]}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshBasicMaterial color="green" />
//       </mesh>

//       <Instances limit={positions.length} geometry={undefined} material={undefined}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshBasicMaterial color="red" />
//         {positions.map((pos, i) => (
//           <Instance key={i} position={pos} />
//         ))}
//       </Instances>
//     </group>
//   );