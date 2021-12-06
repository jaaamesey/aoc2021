import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split(",").map((numStr) => parseInt(numStr));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let currentFish = input.slice();
  for (let day = 1; day <= 80; day++) {
    const newCurrentFish: number[] = [];
    for (const fishTimer of currentFish) {
      let newFishTimer = fishTimer - 1;
      if (newFishTimer < 0) {
        newFishTimer = 6;
        newCurrentFish.push(8); // New fish born
      }
      newCurrentFish.push(newFishTimer);
    }
    currentFish = newCurrentFish;
  }
  return currentFish.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let currentFish = new Map<number, number>();
  input.forEach((number) => {
    const numberInMap = currentFish.get(number) ?? 0;
    currentFish.set(number, numberInMap + 1);
  });

  for (let day = 1; day <= 256; day++) {
    const newCurrentFish = new Map<number, number>();
    for (const fishTimer of currentFish.keys()) {
      const fishAmt = currentFish.get(fishTimer);
      if (!fishAmt) throw "there should be fish here";
      if (fishTimer <= 0) {
        const current6Fish = newCurrentFish.get(6) ?? 0;
        newCurrentFish.set(6, current6Fish + fishAmt);
        // Create new fish
        const current8Fish = newCurrentFish.get(8) ?? 0;
        newCurrentFish.set(8, current8Fish + fishAmt);
      } else {
        const currentMinusOneFish = newCurrentFish.get(fishTimer - 1) ?? 0;
        newCurrentFish.set(fishTimer - 1, currentMinusOneFish + fishAmt);
      }
    }
    currentFish = newCurrentFish;
  }
  let numFish = 0;
  for (const fishAmt of currentFish.values()) {
    numFish += fishAmt;
  }
  return numFish;
};

const testInput = `3,4,3,1,2`;

run({
  part1: {
    tests: [{ input: testInput, expected: 5934 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 26984457539 }],
    solution: part2,
  },
  trimTestInputs: true,
});
