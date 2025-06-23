// 3D libraries
import useGame from '@/stores/useGame';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import React from 'react';

function Bounds({ ...delegated }) {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <CuboidCollider 
        args={[ 0.5, 0.1, 0.5 ]}
        restitution={ 0.2 } 
        friction={ 1 } 
        {...delegated} 
      />
    </RigidBody>
  )
}

export function Water({ ...delegated }) {
  const waterRef = React.useRef();
  const playerRef = useGame((state) => state.player); // Access player ref directly
  const [isInWater, setIsInWater] = React.useState(false);  

  useFrame((state, delta) => {
    if (!isInWater || !playerRef?.current) return;
    const { y } = waterRef.current.translation()
    const body = playerRef.current;
    const pos = body.translation();

    const objectHeight = 0.6;
    const waterSurfaceY = y + 0.5;
    const bottomY = pos.y - objectHeight / 2;

    const submergedDepth = waterSurfaceY - bottomY;
    if (submergedDepth <= 0) return;

    // 💡 Object in water by 50% 
    const targetSubmersion = objectHeight * 0.5;
    const displacement = submergedDepth - targetSubmersion;

    // stregth params
    const stiffness = 4;
    const damping = 3;

    const velocity = body.linvel();

    // 💡 Calculate force 
    const forceY = stiffness * displacement - damping * velocity.y;

    body.addForce({ x: 0, y: forceY * delta, z: 0 }, true);
  });

  const handleIntersectionEnter = (target) => {
    if (!target) return;
    setIsInWater(true);

    const rigidBody = target.collider.parent();
    rigidBody.setLinearDamping(6); // increase drag
    rigidBody.setAngularDamping(6);
    // rigidBody.setLinvel({ x: 0, y: -0.5, z: 0 }, true);
  };

  const handleIntersectionExit = (target) => {
    if (!target) return;
    setIsInWater(false);

    const rigidBody = target.collider.parent();
    rigidBody.setLinearDamping(0.5);
    rigidBody.setAngularDamping(0.5);
    rigidBody.resetForces(true);
  };

  return (
    <RigidBody type="fixed">
      <CuboidCollider
        ref={ waterRef }
        args={ [0.5, 0.5, 0.5] }
        { ...delegated }
        sensor={ true }
        friction={ 0 }
        restitution={ 0 }
        onIntersectionEnter={ handleIntersectionEnter }
        onIntersectionExit={ handleIntersectionExit }
      />
    </RigidBody>
  )
}

export default Bounds;