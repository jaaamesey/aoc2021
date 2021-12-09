import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let riskLevelSum = 0;
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const val = parseInt(input[y][x]);
      const adjacentVals = getAdjacentVals(input, y, x);
      let isDip = true;
      Object.values(adjacentVals).forEach((adj) => {
        if (adj.val == null) return;
        if (adj.val <= val) isDip = false;
      });

      if (isDip) {
        const riskLevel = 1 + val;
        riskLevelSum += riskLevel;
      }
    }
  }
  return riskLevelSum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const basinCounts: number[] = [];
  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const val = parseInt(input[y][x]);
      const adjacentVals = getAdjacentVals(input, y, x);
      let isDip = true;
      Object.values(adjacentVals).forEach((adj) => {
        if (adj.val == null) return;
        if (adj.val <= val) isDip = false;
      });

      if (isDip) {
        const basin = getBasin(input, y, x);
        basinCounts.push(basin.length);
      }
    }
  }
  // Return product of 3 largest basins
  basinCounts.sort((a, b) => b - a);
  return basinCounts[0] * basinCounts[1] * basinCounts[2];
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
    up: { val: cleanVal(input[upY]?.[x]), y: upY, x },
    down: { val: cleanVal(input[downY]?.[x]), y: downY, x },
    left: { val: cleanVal(input[y][leftX]), y, x: leftX },
    rightX: { val: cleanVal(input[y][rightX]), y, x: rightX },
  };
}

function getBasin(input: string[], y: number, x: number) {
  const usedPositions = new Set<string>();
  const valsInBasin = [];

  // Get values of the basin by recursively adding adjacent values, stopping when hitting edges or 9
  function getBasinRec(y: number, x: number) {
    const adjacentVals = getAdjacentVals(input, y, x);
    Object.values(adjacentVals).forEach((adj) => {
      if (
        adj.val == null ||
        adj.val === 9 ||
        usedPositions.has(adj.y + "," + adj.x)
      ) {
        return;
      }
      usedPositions.add(adj.y + "," + adj.x);
      valsInBasin.push(adj);
      getBasinRec(adj.y, adj.x);
    });
  }
  getBasinRec(y, x);
  return valsInBasin;
}

const testInput = `2199943210
3987894921
9856789892
8767896789
9899965678`;

run({
  part1: {
    tests: [{ input: testInput, expected: 15 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 1134 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
