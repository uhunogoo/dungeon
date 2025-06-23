import { BallCollider, CuboidCollider, RigidBody } from '@react-three/rapier';

function Sensor({ ref, children, ...delegated }) {
  return (
    <>
      <RigidBody
        ref={ ref }
        type="fixed"
        sensor={ true }
        restitution={ 0 }
        friction={ 0 }
        { ...delegated }
      >
        { children }
      </RigidBody>
    </>
  )
}

function Ball({ ...delegated }) {
  return (
    <BallCollider 
      args={[ 0.1 ]}
      {...delegated}
    />
  )
}

function Cuboid({ ...delegated }) {
  return (
    <CuboidCollider 
      args={[ 0.1, 0.1, 0.1 ]}
      {...delegated}
    />
  )
}

// export default Sensor;
Sensor.Ball = Ball;
Sensor.Cuboid = Cuboid;

export default Sensor;