// This is awful but it's Saturday so 🤷‍♂️
import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let totalFlashes = 0;
  for (let step = 0; step < 100; step++) {
    const flashedPositions = new Set<string>();
    function incrementOctopus(y: number, x: number) {
      const val = parseInt(input[y][x]);
      let newVal = val >= 9 ? 0 : val + 1;
      if (flashedPositions.has(`${y},${x}`)) {
        return;
      }

      const newRow = input[y].split("");
      newRow[x] = newVal.toString();
      input[y] = newRow.join("");
      if (newVal === 0) {
        // FLASHING!
        totalFlashes++;
        flashedPositions.add(`${y},${x}`);
        const adjacentVals = getAdjacentVals(input, y, x);
        Object.values(adjacentVals).forEach((adj) => {
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
  }

  return totalFlashes;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  for (let step = 0; ; step++) {
    let flashesInStep = 0;
    const flashedPositions = new Set<string>();
    function incrementOctopus(y: number, x: number) {
      const val = parseInt(input[y][x]);
      let newVal = val >= 9 ? 0 : val + 1;
      if (flashedPositions.has(`${y},${x}`)) {
        return;
      }

      const newRow = input[y].split("");
      newRow[x] = newVal.toString();
      input[y] = newRow.join("");
      if (newVal === 0) {
        // FLASHING!
        flashesInStep++;
        flashedPositions.add(`${y},${x}`);
        const adjacentVals = getAdjacentVals(input, y, x);
        Object.values(adjacentVals).forEach((adj) => {
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
    const OCTOPUS_COUNT = input.length * input[0].length;
    if (flashesInStep >= OCTOPUS_COUNT) {
      return step + 1;
    }
  }
};

function getAdjacentVals(input: string[], y: number, x: number) {
  const upY = y - 1;
  const downY = y + 1;
  const leftX = x - 1;
  const rightX = x + 1;
  function cleanVal(numStr?: string) {
    return numStr ? parseInt(numStr) : null;
  }
  return {
    leftUp: { val: cleanVal(input[upY]?.[leftX]), y: upY, x: leftX },
    rightUp: { val: cleanVal(input[upY]?.[rightX]), y: upY, x: rightX },
    rightDown: { val: cleanVal(input[downY]?.[rightX]), y: downY, x: rightX },
    leftDown: { val: cleanVal(input[downY]?.[leftX]), y: downY, x: leftX },
    up: { val: cleanVal(input[upY]?.[x]), y: upY, x },
    down: { val: cleanVal(input[downY]?.[x]), y: downY, x },
    left: { val: cleanVal(input[y][leftX]), y, x: leftX },
    right: { val: cleanVal(input[y][rightX]), y, x: rightX },
  };
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
