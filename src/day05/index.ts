import run from "aocrunner";

type Line = { x1: number; y1: number; x2: number; y2: number };

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines.map((lineStr) => {
    const [pos1, pos2] = lineStr.split(" -> ");
    const [x1, y1] = pos1.split(",").map((valStr) => parseInt(valStr));
    const [x2, y2] = pos2.split(",").map((valStr) => parseInt(valStr));
    return { x1, y1, x2, y2 } as Line;
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Create 1000x1000 2D array
  const MATRIX_SIZE = 1000;
  const positions = [] as number[][];

  input.forEach((line) => {
    // Only consider horizontal and vertical lines
    const isValidLine = line.x1 === line.x2 || line.y1 === line.y2;
    if (!isValidLine) return;
    for (let y = 0; y <= MATRIX_SIZE; y++) {
      for (let x = 0; x <= MATRIX_SIZE; x++) {
        positions[y] ??= [];
        positions[y][x] ??= 0;
        // Check if line intersects point (no diagonals)
        const lowerX = Math.min(line.x1, line.x2);
        const upperX = Math.max(line.x1, line.x2);
        const lowerY = Math.min(line.y1, line.y2);
        const upperY = Math.max(line.y1, line.y2);
        if (x >= lowerX && x <= upperX && y >= lowerY && y <= upperY) {
          positions[y][x]++;
        }
      }
    }
  });

  // Count overlaps
  let numOverlaps = 0;
  for (let y = 0; y <= MATRIX_SIZE; y++) {
    for (let x = 0; x <= MATRIX_SIZE; x++) {
      if (positions[y][x] > 1) {
        numOverlaps++;
      }
    }
  }

  return numOverlaps;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Create 1000x1000 2D array
  const MATRIX_SIZE = 1000;
  const positions = [] as number[][]; // Positions are in [y][x] format

  input.forEach((line) => {
    const mb = getLineMB(line);
    for (let y = 0; y <= MATRIX_SIZE; y++) {
      for (let x = 0; x <= MATRIX_SIZE; x++) {
        positions[y] ??= [];
        positions[y][x] ??= 0;
        const lowerX = Math.min(line.x1, line.x2);
        const upperX = Math.max(line.x1, line.x2);
        const lowerY = Math.min(line.y1, line.y2);
        const upperY = Math.max(line.y1, line.y2);
        if (mb) {
          const { m, b } = mb;
          const isOnInfiniteLine = y === m * x + b;
          if (isOnInfiniteLine) {
            // Check if point still in bounds
            if (x >= lowerX && x <= upperX && y >= lowerY && y <= upperY) {
              positions[y][x]++;
            }
          }
        } else if (x === line.x1 && y >= lowerY && y <= upperY) {
          positions[y][x]++;
        }
      }
    }
  });

  // Count overlaps
  let numOverlaps = 0;
  for (let y = 0; y <= MATRIX_SIZE; y++) {
    for (let x = 0; x <= MATRIX_SIZE; x++) {
      if (positions[y][x] > 1) {
        numOverlaps++;
      }
    }
  }

  return numOverlaps;
};

// Returns the gradient (m) and y-intercept (b) of the provided line
// Thank you Mr. Stoyef from Year 8 maths, I thought I would never use this
function getLineMB(line: Line) {
  if (line.x2 === line.x1) return null; // Return null if gradient would be undefined
  const m = (line.y2 - line.y1) / (line.x2 - line.x1);
  const b = line.y1 - m * line.x1;
  return { m, b };
}

const testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

run({
  part1: {
    tests: [{ input: testInput, expected: 5 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 12 }],
    solution: part2,
  },
  trimTestInputs: true,
});
