export const SocketTypes = {
  WALL_N: "wall_N",
  WALL_E: "wall_E",
  WALL_S: "wall_S",
  WALL_W: "wall_W",

  CORRIDOR_OPEN_N: "corridor_open_N",
  CORRIDOR_OPEN_E: "corridor_open_E",
  CORRIDOR_OPEN_S: "corridor_open_S",
  CORRIDOR_OPEN_W: "corridor_open_W",

  ROOM_ENTRANCE_N: "room_entrance_N",
  ROOM_ENTRANCE_E: "room_entrance_E",
  ROOM_ENTRANCE_S: "room_entrance_S",
  ROOM_ENTRANCE_W: "room_entrance_W"
};
// Tile prototypes - base definitions
export const tile_prototypes = {
  corridor_straight: {
    name: "corridor_straight",
    width: 3,
    height: 3,
    sockets: {
      N: SocketTypes.CORRIDOR_OPEN_N,
      S: SocketTypes.CORRIDOR_OPEN_S,
      E: SocketTypes.WALL_E,
      W: SocketTypes.WALL_W
    },
    layout: [
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1]
    ],
    rotations: 2 // How many unique rotations should be generated (2 for straight corridor)
  },
  
  corridor_L: {
    name: "corridor_L",
    width: 3,
    height: 3,
    sockets: {
      N: SocketTypes.CORRIDOR_OPEN_N,
      S: SocketTypes.WALL_S,
      E: SocketTypes.CORRIDOR_OPEN_E,
      W: SocketTypes.WALL_W
    },
    layout: [
      [1, 0, 1],
      [1, 0, 0],
      [1, 1, 1]
    ],
    rotations: 4 // L-shape has 4 unique rotations
  },
  
  corridor_T: {
    name: "corridor_T",
    width: 3,
    height: 3,
    sockets: {
      N: SocketTypes.CORRIDOR_OPEN_N,
      S: SocketTypes.CORRIDOR_OPEN_S,
      E: SocketTypes.CORRIDOR_OPEN_E,
      W: SocketTypes.WALL_W
    },
    layout: [
      [1, 0, 1],
      [1, 0, 0],
      [1, 0, 1]
    ],
    rotations: 4 // T-shape has 4 unique rotations
  },
  
  corridor_cross: {
    name: "corridor_cross",
    width: 3,
    height: 3,
    sockets: {
      N: SocketTypes.CORRIDOR_OPEN_N,
      S: SocketTypes.CORRIDOR_OPEN_S,
      E: SocketTypes.CORRIDOR_OPEN_E,
      W: SocketTypes.CORRIDOR_OPEN_W
    },
    layout: [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ],
    rotations: 1 // Cross shape has only 1 unique rotation (it's symmetrical)
  },
  
  room_medium_corner_entrances: {
    name: "room_medium_corner_entrances",
    width: 7,
    height: 7,
    sockets: {
      N: SocketTypes.ROOM_ENTRANCE_N,
      S: SocketTypes.WALL_S,
      E: SocketTypes.ROOM_ENTRANCE_E,
      W: SocketTypes.WALL_S
    },
    layout: [
      [1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    rotations: 4 // This room can be rotated 4 ways
  },
  
  room_small_single_entrance: {
    name: "room_small_single_entrance",
    width: 5,
    height: 5,
    sockets: {
      N: SocketTypes.WALL_N,
      S: SocketTypes.ROOM_ENTRANCE_S,
      E: SocketTypes.WALL_E,
      W: SocketTypes.WALL_W
    },
    layout: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1]
    ],
    rotations: 4 // Can have entrance on any side
  }
};