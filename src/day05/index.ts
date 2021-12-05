/*
 * I'm sorry, this is really inefficient, but the ends justify the means
 */

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
  const positions = [] as number[][]; // Positions are in [y][x] format

  // Maximum X and Y points found in all lines
  let maxX = -Infinity;
  let maxY = -Infinity;
  input.forEach((line) => {
    // Only consider non-diagonal (horizontal and vertical) lines, i.e. dx = 0 or dy = 0
    const isValidLine = line.x1 === line.x2 || line.y1 === line.y2;
    if (!isValidLine) return;

    const { upperX, lowerX, upperY, lowerY } = getLineBounds(line);
    if (upperX > maxX) maxX = upperX;
    if (upperY > maxY) maxY = upperY;
    for (let y = 0; y <= upperY; y++) {
      for (let x = 0; x <= upperX; x++) {
        positions[y] ??= [];
        positions[y][x] ??= 0;
        // No lines are diagonal, so we can treat the line the same as a rectangle
        if (isPointInBounds({ x, y, lowerX, upperX, lowerY, upperY })) {
          positions[y][x]++;
        }
      }
    }
  });

  // Count overlaps
  let numOverlaps = 0;
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (positions[y][x] > 1) {
        numOverlaps++;
      }
    }
  }

  return numOverlaps;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const positions = [] as number[][]; // Positions are in [y][x] format

  // Maximum X and Y points found in all lines
  let maxX = -Infinity;
  let maxY = -Infinity;
  input.forEach((line) => {
    const { upperX, lowerX, upperY, lowerY } = getLineBounds(line);
    if (upperX > maxX) maxX = upperX;
    if (upperY > maxY) maxY = upperY;
    const mb = getLineMB(line);
    for (let y = 0; y <= upperY; y++) {
      for (let x = 0; x <= upperX; x++) {
        positions[y] ??= [];
        positions[y][x] ??= 0;
        // Check if line works with y = mx + b equation
        if (mb) {
          const { m, b } = mb;
          const isOnInfiniteLine = y === m * x + b;
          if (isOnInfiniteLine) {
            if (isPointInBounds({ x, y, lowerX, upperX, lowerY, upperY })) {
              positions[y][x]++;
            }
          }
        }
        // Special case: handle lines that go straight downward
        else if (x === line.x1 && y >= lowerY && y <= upperY) {
          positions[y][x]++;
        }
      }
    }
  });

  // Count overlaps
  let numOverlaps = 0;
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (positions[y][x] > 1) {
        numOverlaps++;
      }
    }
  }

  return numOverlaps;
};

// Returns whether point (x,y) is inside bounds of rectangle
function isPointInBounds(opts: {
  x: number;
  y: number;
  lowerX: number;
  upperX: number;
  lowerY: number;
  upperY: number;
}) {
  const { x, y, lowerX, upperX, lowerY, upperY } = opts;
  return x >= lowerX && x <= upperX && y >= lowerY && y <= upperY;
}

function getLineBounds(line: Line) {
  return {
    lowerX: Math.min(line.x1, line.x2),
    upperX: Math.max(line.x1, line.x2),
    lowerY: Math.min(line.y1, line.y2),
    upperY: Math.max(line.y1, line.y2),
  };
}

// Returns the gradient (m) and y-intercept (b) of the provided line
// Thank you Mr. Stoyef from Year 8 maths, I thought I would never use this
function getLineMB(line: Line) {
  // Turns out the whole y = mx + b equation doesn't work for lines that go straight down, so we can't return m & b
  if (line.x2 === line.x1) return null;

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
