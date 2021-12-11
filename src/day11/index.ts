// This is awful but it's Saturday so 🤷‍♂️
import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return runSteps(input, 100).totalFlashes;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const OCTOPUS_COUNT = input.length * input[0].length;
  const { step } = runSteps(input, Infinity, (flashedPositions) => {
    if (flashedPositions.size >= OCTOPUS_COUNT) {
      return true; // Halt
    }
  });
  return step;
};

function runSteps(
  input: string[],
  numSteps: number,
  onStepCompleted?: (flashedPositions: Set<string>) => boolean | undefined,
) {
  let totalFlashes = 0;
  for (let step = 1; step <= numSteps; step++) {
    const flashedPositions = new Set<string>();
    function incrementOctopus(y: number, x: number) {
      if (flashedPositions.has(`${y},${x}`)) {
        return;
      }

      const val = parseInt(input[y][x]);
      let newVal = val >= 9 ? 0 : val + 1;

      const newRow = input[y].split("");
      newRow[x] = newVal.toString();
      input[y] = newRow.join("");

      if (newVal === 0) {
        // FLASHING!
        flashedPositions.add(`${y},${x}`);
        totalFlashes++;
        getAdjacentPositions(input, y, x).forEach((adj) => {
          if (adj.val == null) return;
          incrementOctopus(adj.y, adj.x);
        });
      }
    }
    for (let y = 0; y < input.length; y++) {
      const row = input[y];
      for (let x = 0; x < row.length; x++) {
        incrementOctopus(y, x);
      }
    }
    flashedPositions.forEach((val) => {
      const [y, x] = val.split(",").map(parseInt);
      const newRow = input[y].split("");
      newRow[x] = "0";
      input[y] = newRow.join("");
    });
    const halt = onStepCompleted?.(flashedPositions);
    if (halt) return { totalFlashes, step };
  }
  return { totalFlashes, step: numSteps };
}

function getAdjacentPositions(input: string[], y: number, x: number) {
  function getPos(dy: number, dx: number) {
    function cleanVal(numStr?: string) {
      return numStr ? parseInt(numStr) : null;
    }
    return { val: cleanVal(input[y + dy]?.[x + dx]), y: y + dy, x: x + dx };
  }
  return [
    getPos(1, -1),
    getPos(1, 0),
    getPos(1, 1),
    getPos(-1, -1),
    getPos(-1, 0),
    getPos(-1, 1),
    getPos(0, -1),
    getPos(0, 1),
  ];
}

const testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

run({
  part1: {
    tests: [{ input: testInput, expected: 1656 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 195 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
