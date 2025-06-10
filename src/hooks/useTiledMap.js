import React from 'react';

export function useTiledMap( map ) {
  const tilesSet = React.useMemo(() => {
    if ( !map ) return [];
    const layers = map.layers?.map( ( layer ) => {
      const newLayer = {
        id: layer.id,
        name: layer.name,
        data: false,
      };

      if ( layer.name === 'grass' || !layer.data ) return newLayer; // skip unused layer 

      // generrate tiles positions data
      const newData = [];
      layer.data?.forEach( ( tile, index ) => {
        if ( tile === 0 ) return; // skip empty tiles
        const x = (index % layer.width) - layer.width / 2;
        const z = Math.floor(index / layer.width) - layer.height / 2;
        newData.push([x, 0.5, z ]);
      });

      // set new layer data
      newLayer.data = newData;
      
      return newLayer;
    });


    return {
      width: map.width,
      height: map.height,
      layers
    };
  }, [ map ]);

  return tilesSet;
}