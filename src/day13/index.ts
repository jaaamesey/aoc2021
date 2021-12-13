import run from "aocrunner";

type XYPos = `${string},${string}`; // x,y format
type Axis = "x" | "y"; // y = fold from bottom to up, x = fold from right to left

const parseInput = (rawInput: string) => {
  const [pointsStr, foldsStr] = rawInput.split("\n\n");
  const points = new Set<XYPos>();
  pointsStr.split("\n").forEach((pointStr) => {
    points.add(pointStr as XYPos);
  });

  const folds = foldsStr.split("\n").map((rawFoldStr) => {
    const [, foldStr] = rawFoldStr.split("fold along "); //
    const [axis, posStr] = foldStr.split("=");
    return { axis: axis as Axis, foldBeforePos: parseInt(posStr) };
  });

  return { points, folds };
};

const part1 = (rawInput: string) => {
  const { points, folds } = parseInput(rawInput);
  // Only running first instruction
  const { axis, foldBeforePos } = folds[0];
  const newPoints = new Set<XYPos>();
  points.forEach((pos) => {
    const [x, y] = pos.split(",").map((str) => parseInt(str));
    const posOnAxis = axis === "x" ? x : y;
    if (posOnAxis < foldBeforePos) {
      newPoints.add(pos);
    } else {
      pos =
        axis === "x"
          ? `${foldBeforePos * 2 - x},${y}`
          : `${x},${foldBeforePos * 2 - y}`;
      newPoints.add(pos);
    }
  });
  return newPoints.size;
};

const part2 = (rawInput: string) => {
  let { points, folds } = parseInput(rawInput);
  // Fold the paper according to full list of instructions
  for (const fold of folds) {
    const { axis, foldBeforePos } = fold;
    const newPoints = new Set<XYPos>();
    points.forEach((pos) => {
      const [x, y] = pos.split(",").map((str) => parseInt(str));
      const posOnAxis = axis === "x" ? x : y;
      if (posOnAxis < foldBeforePos) {
        newPoints.add(pos);
      } else {
        pos =
          axis === "x"
            ? `${foldBeforePos * 2 - x},${y}`
            : `${x},${foldBeforePos * 2 - y}`;
        newPoints.add(pos);
      }
    });
    points = newPoints;
  }

  // Print final state of paper to console. The output should represent 8 uppercase letters, which shows the "solution".
  // I'm not going to convert the representation of these characters to the string they actually represent - the solution
  // should be visible in the console.
  let maxX = 0;
  let maxY = 0;
  points.forEach((pos) => {
    const [x, y] = pos.split(",").map((str) => parseInt(str));
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });
  let output = "";
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      output += points.has(`${x},${y}`) ? "#" : ".";
    }
    output += "\n";
  }
  console.log(output);
  return points.size;
};

const testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

run({
  part1: {
    tests: [{ input: testInput, expected: 17 }],
    solution: part1,
  },
  part2: {
    // Part 2 only used to verify that folding code works correctly
    tests: [{ input: testInput, expected: 16 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
