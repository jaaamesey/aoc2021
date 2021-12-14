// This is awful, I'm sorry

import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [polymerTemplate, pairInsertionRulesStr] = rawInput.split("\n\n");
  const pairInsertionRules = new Map<string, string>();
  pairInsertionRulesStr.split("\n").forEach((str) => {
    const [pairStr, elementToInsert] = str.split(" -> ");
    pairInsertionRules.set(pairStr, elementToInsert);
  });
  return { polymerTemplate, pairInsertionRules };
};

const part1 = (rawInput: string) => {
  return getAnswer(rawInput, 10);
};

const part2 = (rawInput: string) => {
  return getAnswer(rawInput, 40);
};

function getAnswer(rawInput: string, numSteps: number) {
  const { polymerTemplate, pairInsertionRules } = parseInput(rawInput);

  // You might think memoizing this function is a micro-optimization, but NO.
  // Without memoizing solvePair(), 40 steps will take some ridiculous amount of time
  // (potentially infinite, nothing happened after running it for 30m), instead of ~7ms.
  const solvePairMemo = new Map<
    `${string},${number}`,
    ReadonlyMap<string, number>
  >();

  function solvePair(pair: string, steps: number) {
    const memoized = solvePairMemo.get(`${pair},${steps}`);
    if (memoized) {
      return memoized;
    }

    const elementCounts = new Map<string, number>();
    if (steps <= 0) {
      return elementCounts as ReadonlyMap<string, number>;
    }

    const newElement = pairInsertionRules.get(pair);
    if (!newElement) throw new Error("Rule not found for " + newElement);

    const currentCount = elementCounts.get(newElement) ?? 0;
    elementCounts.set(newElement, currentCount + 1);

    const pairA = pair[0] + newElement;
    const pairB = newElement + pair[1];

    const mapCountsToTotal = (count: number, element: string) => {
      const currentCount = elementCounts.get(element) ?? 0;
      elementCounts.set(element, currentCount + count);
    };
    solvePair(pairA, steps - 1).forEach(mapCountsToTotal);
    solvePair(pairB, steps - 1).forEach(mapCountsToTotal);

    solvePairMemo.set(`${pair},${steps}`, elementCounts);
    return elementCounts as ReadonlyMap<string, number>;
  }

  const elementCounts = new Map<string, number>();
  for (let c = 0; c < polymerTemplate.length; c++) {
    // Set up initial element count
    const currentCount = elementCounts.get(polymerTemplate[c]) ?? 0;
    elementCounts.set(polymerTemplate[c], currentCount + 1);
    // For each pair of elements in the array, add counts for the additional
    // elements that would be inserted after the provided number of steps.
    if (c < polymerTemplate.length - 1) {
      const pair = polymerTemplate[c] + polymerTemplate[c + 1];
      solvePair(pair, numSteps).forEach((count, element) => {
        const currentCount = elementCounts.get(element) ?? 0;
        elementCounts.set(element, currentCount + count);
      });
    }
  }

  let maxElementCount = -Infinity;
  let minElementCount = Infinity;
  elementCounts.forEach((elementCount) => {
    if (elementCount < minElementCount) minElementCount = elementCount;
    if (elementCount > maxElementCount) maxElementCount = elementCount;
  });

  return maxElementCount - minElementCount;
}

const testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

run({
  part1: {
    tests: [{ input: testInput, expected: 1588 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 2188189693529 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
