import run from "aocrunner";

type Pos = `${number},${number}`; // x,y format
type Point = {
  adjacentPositions: Pos[];
  pos: Pos;
  risk: number;
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

const parseInput = (rawInput: string) => {
  const rows = rawInput
    .split("\n")
    .map((rowStr) => rowStr.split("").map((numStr) => parseInt(numStr)));

  const graph = new DirectedGraph();

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const adjacent = getAdjacentPositions(rows, y, x);
      const point = {
        pos: `${x},${y}` as Pos,
        adjacentPositions: [] as Pos[],
        risk: rows[y][x],
      };
      adjacent.forEach((pos) => {
        point.adjacentPositions.push(pos);
      });
      graph.set(point.pos, point);
    }
  }
  graph.endPointKey = `${rows[0].length - 1},${rows.length - 1}`;
  return graph;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return dijkstra(input, input.start);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

function getAdjacentPositions(input: number[][], y: number, x: number): Pos[] {
  function getPos(dy: number, dx: number) {
    const exists = !!input[y + dy]?.[x + dx];
    return exists ? `${x + dx},${y + dy}` : null;
  }
  return [getPos(1, 0), getPos(-1, 0), getPos(0, -1), getPos(0, 1)].filter(
    (key) => key != null,
  ) as Pos[];
}

function dijkstra(graph: DirectedGraph, source: Point) {
  const distances = new Map<Pos, number>();
  const queue: Pos[] = [];
  distances.set(source.pos, 0);
  graph.forEach((point) => {
    if (point.pos !== source.pos) {
      distances.set(point.pos, Infinity);
    }
    queue.push(point.pos);
  });

  while (queue.length) {
    queue.sort((a, b) => distances.get(b)! - distances.get(a)!);
    const pointU = graph.get(queue.pop()!)!;
    pointU.adjacentPositions.forEach((posV) => {
      if (!queue.includes(posV)) return;
      const alt = distances.get(pointU.pos)! + graph.get(posV)!.risk;
      if (alt < distances.get(posV)!) {
        distances.set(posV, alt);
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
  onlyTests: true,
});
