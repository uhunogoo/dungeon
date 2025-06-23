import Sensor from '@/components/Sensor/Sensor';

const BUTTON_PARAMS = {
  size: [ 0.1, 1, 0.1 ],
  sensorSize: [ 0.5, 1, 0.5 ],
  position: [ 1, 0.5, 0 ],
  rotation: [ 0, 0, 0 ],  
  color: 'green'
}

function Button({ ...delegated }) {
  return (
    <group>
      <mesh
        position={ BUTTON_PARAMS.position } 
        {...delegated}
      >
        <boxGeometry args={ BUTTON_PARAMS.size } />
        <meshStandardMaterial color="green" />
      </mesh>
      
      <Sensor 
        position={ 
          sensorPosition(BUTTON_PARAMS.position, BUTTON_PARAMS.size) 
        }
      >
        <Sensor.Cuboid args={ BUTTON_PARAMS.sensorSize } />
      </Sensor>
    </group>
  )
}

function sensorPosition(position, size) {
  return [
    position[0],
    position[1] + size[1] / 2,
    position[2]
  ]
}

export default Button;
