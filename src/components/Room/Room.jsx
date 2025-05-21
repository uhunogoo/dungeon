function Room({ x, y, width, height }) {
  // if (!x || !y || !width || !height) {
  //   return null; // Return null if any prop is missing
  // }

  return (
    <mesh position={[x + width / 2, 0, y + height / 2]}>
      <boxGeometry args={[width, 1, height]} />
      <meshBasicMaterial color='orange' />
    </mesh>
  );
}

export default Room;