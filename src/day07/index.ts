import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split(",").map((numStr) => parseInt(numStr));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let maxNumInInput = 0;
  input.forEach((n) => {
    if (n > maxNumInInput) maxNumInInput = n;
  });

  let fuelCost = Infinity;
  for (let i = 0; i <= maxNumInInput; i++) {
    let currentFuelCost = 0;
    input.forEach((n) => {
      currentFuelCost += Math.abs(n - i);
    });
    if (currentFuelCost < fuelCost) fuelCost = currentFuelCost;
  }

  return fuelCost;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let maxNumInInput = 0;
  input.forEach((n) => {
    if (n > maxNumInInput) maxNumInInput = n;
  });

  let fuelCost = Infinity;
  for (let i = 0; i <= maxNumInInput; i++) {
    let currentFuelCost = 0;
    input.forEach((n) => {
      const numberOfMoves = Math.abs(n - i);
      // An additional cost is now applied for each move, which increases by 1 with each move.
      // So, for a crab's move that cost 5 points in the original implementation, it would instead
      // cost 1 + 2 + 3 + 4 + 5 fuel. Conveniently, there is a formula that already handles this.
      const cost = summation(numberOfMoves);
      currentFuelCost += cost;
    });
    if (currentFuelCost < fuelCost) fuelCost = currentFuelCost;
  }

  return fuelCost;
};

/*
 * Applies the summation formula to the given number
 * e.g. summation(5) = 1 + 2 + 3 + 4 + 5 = 15
 * Stolen from https://math.stackexchange.com/a/60579
 */
function summation(n: number) {
  return (Math.pow(n, 2) + n) / 2;
}

const testInput = `16,1,2,0,4,2,7,1,2,14`;

run({
  part1: {
    tests: [{ input: testInput, expected: 37 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 168 }],
    solution: part2,
  },
  trimTestInputs: true,
});
