import React from 'react';

// import { RoadTileStandart, RoadTreeTile } from '../RoadTile/RoadTile';
import { Instance, Instances } from '@react-three/drei';
import { useTiledMap } from '@/hooks/useTiledMap';

// rename to brickedRoads
function Road({ map }) {
  const tilesSet = useTiledMap( map );
  
  return (
    <group>
      <mesh scale={[tilesSet.width, 1, tilesSet.height]} position={[0, -0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="green" />
      </mesh>
      { tilesSet.layers?.map((layer, index) =>
        layer.data && (
          <Instances key={ layer.name } limit={layer.data.length} geometry={undefined} material={undefined}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="red" />
            { layer.data.map(([ x, y, z ], i) => (
              <Instance key={ i } position={[ x, y, z + 0.5 ]} />
            )) }
          </Instances>
        )
      )}
    </group>
  );
}

export default Road;