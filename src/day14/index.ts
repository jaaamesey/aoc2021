import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [polymerTemplate, pairInsertionRulesStr] = rawInput.split("\n\n");
  const pairInsertionRules = new Map<string, string>();
  pairInsertionRulesStr.split("\n").forEach((str) => {
    const [pairStr, elementToInsert] = str.split(" -> ");
    pairInsertionRules.set(pairStr, elementToInsert);
    // return {
    //   left: pairStr[0],
    //   right: pairStr[1],
    //   elementToInsert,
    // };
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
  let { polymerTemplate, pairInsertionRules } = parseInput(rawInput);
  // Apply insertion rules to polymer template for numSteps
  for (let i = 1; i <= numSteps; i++) {
    let newPolymerTemplate = "";
    for (let c = 0; c < polymerTemplate.length; c++) {
      const pair = polymerTemplate[c] + polymerTemplate[c + 1];
      const elementToInsert = pairInsertionRules.get(pair);
      if (elementToInsert) {
        newPolymerTemplate += polymerTemplate[c] + elementToInsert;
      } else {
        newPolymerTemplate += polymerTemplate[c];
      }
    }
    polymerTemplate = newPolymerTemplate;
  }

  const elementCounts = new Map<string, number>();
  for (const element of polymerTemplate) {
    const currentCount = elementCounts.get(element) ?? 0;
    elementCounts.set(element, currentCount + 1);
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
  onlyTests: true,
});
