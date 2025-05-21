'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const levels = {
  level_1: dynamic(() => import('../Level1/Level1'), { ssr: false }),
  level_2: dynamic(() => import('../Level2/Level2'), { ssr: false }),
};

function SceneManager() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level');

  const Level = React.useMemo(() => {
    switch (level) {
      case '1':
        return levels.level_1;
      case '2':
        return levels.level_2;
      default:
        return levels.level_1;
    }
  }, [ level ]);

  return (
    <Level />
  )
}

export default SceneManager;