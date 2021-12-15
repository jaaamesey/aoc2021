import run from "aocrunner";
import PriorityQueue from "fastpriorityqueue";

type Pos = `${number},${number}`; // x,y format
type Point = {
  pos: Pos;
  risk: number;
  x: number;
  y: number;
};

// Whilst this implementation is a *directed* graph, for this task, edges will be duplicated
// in a way where this effectively ends up as an undirected graph.
class DirectedGraph extends Map<Pos, Point> {
  endPointKey: Pos | undefined;
  get start() {
    const startPoint = this.get("0,0");
    if (!startPoint) throw new Error("Could not find start point");
    return startPoint;
  }
  get end() {
    const endPoint = this.get(this.endPointKey!);
    if (!endPoint) throw new Error("Could not find end point");
    return endPoint;
  }
}

const parseInput = (rawInput: string, extendByFive = false) => {
  const rows = rawInput
    .split("\n")
    .map((rowStr) => rowStr.split("").map((numStr) => parseInt(numStr)));

  if (extendByFive) {
    const originalRows = rows.slice();
    const originalHeight = originalRows.length;
    const originalWidth = originalRows[0].length;
    // Extend initial rows vertically
    for (let i = 1; i < 5; i++) {
      for (let y = 0; y < originalHeight; y++) {
        const offsetY = i * originalHeight;
        for (let x = 0; x < originalWidth; x++) {
          const originalValue = originalRows[y][x];
          let newValue = originalValue + i;
          if (newValue > 9) newValue = newValue % 9;
          if (!rows[y + offsetY]) rows[y + offsetY] = [];
          rows[y + offsetY][x] = newValue;
        }
      }
    }
    for (let y = 0; y < rows.length; y++) {
      for (let i = 1; i < 5; i++) {
        for (let x = 0; x < originalWidth; x++) {
          const offsetX = i * originalWidth;
          const originalValue = rows[y][x];
          if (isNaN(originalValue)) throw JSON.stringify({ y, x });
          let newValue = originalValue + i;
          if (newValue > 9) newValue = newValue % 9;
          rows[y][x + offsetX] = newValue;
        }
      }
    }
  }

  const graph = new DirectedGraph();
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const point = {
        pos: `${x},${y}` as Pos,
        risk: rows[y][x],
        x,
        y,
      };
      graph.set(point.pos, point);
    }
  }
  graph.endPointKey = `${rows[0].length - 1},${rows.length - 1}`;
  return { graph, rows };
};

const part1 = (rawInput: string) => {
  const { graph, rows } = parseInput(rawInput);
  return dijkstra(graph, rows, graph.start);
};

const part2 = (rawInput: string) => {
  const { graph, rows } = parseInput(rawInput, true);
  return dijkstra(graph, rows, graph.start);
};

function getAdjacentPositions(input: number[][], y: number, x: number): Pos[] {
  const positions: Pos[] = [];
  [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
  ].forEach(([dy, dx]) => {
    const exists = !!input[y + dy]?.[x + dx];
    if (exists) positions.push(`${x + dx},${y + dy}`);
  });
  return positions;
}

function dijkstra(graph: DirectedGraph, rows: number[][], source: Point) {
  const distances = new Map<Pos, number>();
  const queue: Pos[] = [];

  distances.set(source.pos, 0);
  graph.forEach((point) => {
    if (point.pos !== source.pos) {
      distances.set(point.pos, Infinity);
    }
    queue.push(point.pos);
  });

  let queueNeedsSort = true;
  while (queue.length) {
    queueNeedsSort &&
      queue.sort((a, b) => distances.get(b)! - distances.get(a)!);
    queueNeedsSort = false;

    const pointU = graph.get(queue.pop()!);
    if (!pointU) throw new Error();
    const pointUAdjacentPositions = getAdjacentPositions(
      rows,
      pointU.y,
      pointU.x,
    );

    pointUAdjacentPositions.forEach((posV) => {
      if (!queue.includes(posV)) return;
      const uDistance = distances.get(pointU.pos);
      const pointV = graph.get(posV);
      if (uDistance == null || pointV == null) throw new Error();
      const alt = uDistance + pointV.risk;
      if (alt < distances.get(posV)!) {
        distances.set(posV, alt);
        queueNeedsSort = true;
      }
    });
  }
  return distances.get(graph.endPointKey!);
}

const testInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

run({
  part1: {
    tests: [{ input: testInput, expected: 40 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 315 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
