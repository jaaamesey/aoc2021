import run from "aocrunner";

type Command = {
  direction: "forward" | "up" | "down";
  amount: number;
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((commandStr) => {
    const [direction, amtStr] = commandStr.split(" ");
    return { direction, amount: parseInt(amtStr) } as Command;
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let x = 0;
  let y = 0; // Depth: + is down, - is up
  for (let { direction, amount } of input) {
    switch (direction) {
      case "forward":
        x += amount;
        break;
      case "down":
        y += amount;
        break;
      case "up":
        y -= amount;
        break;
    }
  }
  return x * y;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let x = 0;
  let y = 0; // Depth: + is down, - is up
  let aim = 0;
  for (let { direction, amount } of input) {
    switch (direction) {
      case "forward":
        x += amount;
        y += aim * amount;
        break;
      case "down":
        aim += amount;
        break;
      case "up":
        aim -= amount;
        break;
    }
  }
  return x * y;
};

const testInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 900 }],
    solution: part2,
  },
  trimTestInputs: true,
});
