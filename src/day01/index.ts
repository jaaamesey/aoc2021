import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((str) => parseInt(str));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let timesIncreased = 0;
  input.forEach((num, index) => {
    const prevNum = input[index - 1];
    if (num > prevNum) timesIncreased++;
  });
  return timesIncreased;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let prevSum = -Infinity;
  let timesIncreased = 0;
  for (let i = 1; i < input.length; i++) {
    const slidingWindow = input.slice(
      Math.max(i - 2, 0),
      Math.min(i + 1, input.length - 2),
    );
    let sum = 0;
    slidingWindow.forEach((n) => (sum += n));
    if (sum > prevSum) timesIncreased++;
    prevSum = sum;
  }
  return timesIncreased;
};

const testInput = `199
200
208
210
200
207
240
269
260
263`;

run({
  part1: {
    tests: [{ input: testInput, expected: 7 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 5 }],
    solution: part2,
  },
  trimTestInputs: true,
});
