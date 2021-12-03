import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const BYTE_LENGTH = input[0].length;
  let gamma = ""; // Char array of most common bit in position
  let epsilon = ""; // Char array of least common bit in position
  for (let bitIndex = 0; bitIndex < BYTE_LENGTH; bitIndex++) {
    let counts = { "0": 0, "1": 0 };
    input.forEach((byte) => {
      const bit = byte[bitIndex] as "0" | "1";
      counts[bit]++;
    });
    if (counts["1"] >= counts["0"]) {
      gamma += "1";
      epsilon += "0";
    } else {
      gamma += "0";
      epsilon += "1";
    }
  }
  const gammaDecimal = parseInt(gamma, 2);
  const epsilonDecimal = parseInt(epsilon, 2);
  return gammaDecimal * epsilonDecimal;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const oxygenRating = getRating(input, "keep_most_common");
  const co2Rating = getRating(input, "keep_least_common");
  return oxygenRating * co2Rating;
};

function getRating(
  input: string[],
  mode: "keep_most_common" | "keep_least_common",
) {
  const BYTE_LENGTH = input[0].length;
  let filteredInput = input.slice();
  for (let bitIndex = 0; bitIndex < BYTE_LENGTH; bitIndex++) {
    // Calculate most common bit in position
    let counts = { "0": 0, "1": 0 };
    filteredInput.forEach((byte) => {
      const bit = byte[bitIndex] as "0" | "1";
      counts[bit]++;
    });
    const mostCommonBit = counts["1"] >= counts["0"] ? "1" : "0";
    // Discard bytes based on mode
    filteredInput = filteredInput.filter((byte) =>
      mode === "keep_most_common"
        ? byte[bitIndex] === mostCommonBit
        : byte[bitIndex] !== mostCommonBit,
    );
    if (filteredInput.length === 1) break;
  }
  return parseInt(filteredInput[0], 2);
}

const testInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

run({
  part1: {
    tests: [{ input: testInput, expected: 198 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 230 }],
    solution: part2,
  },
  trimTestInputs: true,
});
