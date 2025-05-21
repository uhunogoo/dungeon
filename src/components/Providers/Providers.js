'use client';

import PrototypesProvider from './PrototypesProvider';

function Providers({ children }) {
  return(
    <PrototypesProvider>
      { children }
    </PrototypesProvider>
  )
} 
export default Providers;