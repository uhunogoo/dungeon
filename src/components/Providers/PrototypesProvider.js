'use client'
import React from 'react';
import { tile_prototypes } from '@/lib/prototypes';
import { generateTileCatalog } from '@/lib/prototypes_helper';

export const PrototypesContext = React.createContext();

function PrototypesProvider({ children }) {
  const prototypes = React.useMemo(() => {
    const prototypes = tile_prototypes;
    const generatedPrototypesCatalog = generateTileCatalog( prototypes ); 
    
    return generatedPrototypesCatalog;
  }, []);
  
  // const value = React.useMemo(() => {
  //   return {
  //     prototypes
  //   };
  // }, [ prototypes ]);
  
  return (
    <PrototypesContext.Provider value={{ prototypes }}>
      {children}
    </PrototypesContext.Provider>
  );
}

export default PrototypesProvider;