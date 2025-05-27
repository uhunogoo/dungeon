import { Delaunay } from 'd3-delaunay';

export const range = (start, end, step = 1) => {
  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export function generatePartitionedRooms(GRID_SIZE = 0, sectorsPerRow = 1, sectorsPerCol = 1) {
  const rooms = [];
  
  if ( GRID_SIZE === 0 ) rooms;

  const sectorWidth = GRID_SIZE / sectorsPerRow;
  const sectorHeight = GRID_SIZE / sectorsPerCol;

  for (let i = 0; i < sectorsPerRow; i++) {
    for (let j = 0; j < sectorsPerCol; j++) {
      const maxRoomWidth = Math.floor(sectorWidth * 0.8);
      const maxRoomHeight = Math.floor(sectorHeight * 0.8);

      const width = Math.floor(Math.random() * (maxRoomWidth - 4)) + 4;
      const height = Math.floor(Math.random() * (maxRoomHeight - 4)) + 4;

      const x = Math.floor(i * sectorWidth + Math.random() * (sectorWidth - width));
      const y = Math.floor(j * sectorHeight + Math.random() * (sectorHeight - height));

      const center = {
        x: x + width / 2,
        y: y + height / 2,
      }

      rooms.push({ x, y, width, height, center });
    }
  }

  return rooms;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function delaunayEdges(rooms) {
  const points = rooms.map(r => [r.center.x, r.center.y]);
  
  const delaunay = Delaunay.from(points);
  const triangles = delaunay.triangles;
  
  const edges = new Set();
  
  for (let i = 0; i < triangles.length; i += 3) {
    const a = triangles[i];
    const b = triangles[i + 1];
    const c = triangles[i + 2];
    
    for (const [u, v] of [[a, b], [b, c], [c, a]]) {
      const id = [Math.min(u, v), Math.max(u, v)].join(',');
      edges.add(id);
    }
  }
  
  return Array.from(edges).map(id => {
    const [i, j] = id.split(',').map(Number);
    return [rooms[i].center, rooms[j].center];
  });
}

export function buildMSTFromEdges( rooms, edges) {
  const pointToIndex = new Map(
    rooms.map((r, i) => [r.center.x + ',' + r.center.y, i])
  );

  const indexEdges = edges.map(([a, b]) => {
    const i = pointToIndex.get(a.x + ',' + a.y);
    const j = pointToIndex.get(b.x + ',' + b.y);
    return { i, j, dist: distance(a, b) };
  });

  const connected = new Set();
  const finalEdges = [];

  connected.add(indexEdges[0].i); // Починаємо з будь-якої вершини

  while (connected.size < rooms.length) {
    let best = null;

    for (const edge of indexEdges) {
      const inA = connected.has(edge.i);
      const inB = connected.has(edge.j);

      if (inA !== inB) {
        if (!best || edge.dist < best.dist) {
          best = edge;
        }
      }
    }

    if (best) {
      finalEdges.push([rooms[best.i].center, rooms[best.j].center]);
      connected.add(best.i);
      connected.add(best.j);
    } else {
      break; // обірвати, якщо не знайшли — на всяк випадок
    }
  }

  return finalEdges;
}