import { Instance, Instances } from '@react-three/drei';
import React from 'react';
import useSWR from 'swr';
import Road from '../Road/Road';

const TILE_SIZE = 32; // Assuming each tile is 32x32 units
const ENDPOINT = '/tile-map/level-1.json';

async function fetcher(endpoint) {
  const response = await fetch(endpoint);
  const json = await response.json();
  
  return json;
}

function Level2() {
  const { data, error } = useSWR(ENDPOINT, fetcher);

  return (
    <group>
      {/* { data && <LevelGround data={ data?.layers || null } /> } */}
      { data && <Road map={ data } /> }
      { data && <Buildings data={ data?.layers } /> }
    </group>
  )
}

function Buildings({ data }) {
  const map = React.useMemo(() => {
    const buildings = data.find(layer => layer.name === 'objects');
    return buildings ? buildings : [];
  }, [data]);
  
  return (
    <group position={[-32, 0, -32]}>
      { map?.objects?.map((house, index) => {
        const { width, height, x, y } = house;
        const tileSizeX = width / TILE_SIZE;
        const tileSizeZ = height / TILE_SIZE; 
        const tilePositionX = Math.floor( (x / TILE_SIZE) + tileSizeX / 2 );
        const tilePositionZ = Math.floor( (y / TILE_SIZE) + tileSizeZ / 2 );
        return (
          
          <mesh 
            key={index} 
            position={[ tilePositionX, 1, tilePositionZ ]} 
            scale={[ tileSizeX, 2, tileSizeZ ]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="blue" />
          </mesh>
        );
      })}
    </group>
  )
}

function LevelGround({ data }) {
  const map = React.useMemo(() => {
    const grass = data.find(layer => layer.name === 'grass');
    return grass ? grass : { data: [], width: 0, height: 0 };
  }, [data]);

  const positions = React.useMemo(() => {
    const tiles = [];
    map.data.forEach((tile, index) => {
      if (tile === 1) return; // Пропускаємо пусті
      const x = (index % map.width) - map.width / 2;
      const z = Math.floor(index / map.width) - map.height / 2;
      tiles.push([x, 0.5, z]);
    });
    return tiles;
  }, [map]);

  return (
    <group>
      <mesh scale={[map.width, 1, map.height]} position={[0, -0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="green" />
      </mesh>

      <Instances limit={positions.length} geometry={undefined} material={undefined}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
        {positions.map((pos, i) => (
          <Instance key={i} position={pos} />
        ))}
      </Instances>
    </group>
  );
}
  

export default Level2;