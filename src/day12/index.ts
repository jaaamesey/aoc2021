import run from "aocrunner";

type Point = {
  adjacentPoints: Point[];
  key: string;
  type: "cave" | "small_cave" | "start" | "end";
};

// Whilst this implementation is a *directed* graph, for this task, edges will be duplicated
// in a way where this effectively ends up as an undirected graph.
class DirectedGraph extends Map<string, Point> {
  get start() {
    const startPoint = this.get("start");
    if (!startPoint) throw new Error("Could not find start point");
    return startPoint;
  }
  get end() {
    const endPoint = this.get("end");
    if (!endPoint) throw new Error("Could not find end point");
    return endPoint;
  }
}

function getTypeFromKey(key: string): Point["type"] {
  if (key === "start" || key === "end") {
    return key;
  } else if (key === key.toUpperCase()) {
    return "cave";
  } else if (key === key.toLowerCase()) {
    return "small_cave";
  } else {
    throw new Error("Unsupported point type: " + key);
  }
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  // Create points from edges
  const graph = new DirectedGraph();
  lines.forEach((str) => {
    const [keyA, keyB] = str.split("-");
    const [pointA, pointB] = [keyA, keyB].map((key) => {
      if (!graph.has(key)) {
        graph.set(key, {
          key,
          type: getTypeFromKey(key),
          adjacentPoints: [],
        });
      }
      const point = graph.get(key);
      if (!point) throw "Could not find point";
      return point;
    });

    // Add each other to adjacency lists
    // (graph implementation is directed, so we need to simulate undirected by adding both directions)
    pointA.adjacentPoints.push(pointB);
    pointB.adjacentPoints.push(pointA);
  });

  return graph;
};

const part1 = (rawInput: string) => {
  const graph = parseInput(rawInput);
  let numPaths = 0;
  // Perform a depth-first search using the magic of recursion
  function dfs(point: Point, visited: Set<string>) {
    visited = new Set<string>(visited);

    if (point.type === "end") {
      numPaths++;
      return;
    }
    if (point.type !== "cave") {
      visited.add(point.key);
    }
    for (const adjacentPoint of point.adjacentPoints) {
      if (!visited.has(adjacentPoint.key)) {
        dfs(adjacentPoint, visited);
      }
    }
  }
  dfs(graph.start, new Set<string>());
  return numPaths;
};

const part2 = (rawInput: string) => {
  const graph = parseInput(rawInput);
  const smallCaves: Point[] = [];
  graph.forEach((point) => {
    if (point.type === "small_cave") smallCaves.push(point);
  });

  // Store explored paths in a set, as running a search for each small cave will result in duplicates.
  const exploredPaths = new Set<string>();
  // For each small cave, do pretty much the same thing as part 1, but treat the current small cave as "special" in
  // that it won't be considered "visited" until it is hit twice. (I assume there's faster ways of doing this?)
  for (const smallCave of smallCaves) {
    function dfs(
      point: Point,
      visited: Set<string>,
      currentPath: string,
      currentSmallCaveExploredOnce: boolean,
    ) {
      visited = new Set<string>(visited);

      if (point.type === "end") {
        exploredPaths.add(currentPath);
        return;
      }
      if (point.type !== "cave") {
        if (point.key === smallCave.key) {
          if (currentSmallCaveExploredOnce) {
            visited.add(point.key);
          } else {
            currentSmallCaveExploredOnce = true;
          }
        } else {
          visited.add(point.key);
        }
      }
      for (const adjacentPoint of point.adjacentPoints) {
        if (!visited.has(adjacentPoint.key)) {
          dfs(
            adjacentPoint,
            visited,
            currentPath + "," + adjacentPoint.key,
            currentSmallCaveExploredOnce,
          );
        }
      }
    }
    dfs(graph.start, new Set<string>(), "start", false);
  }

  return exploredPaths.size;
};

const testInput = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

run({
  part1: {
    tests: [{ input: testInput, expected: 10 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 36 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
