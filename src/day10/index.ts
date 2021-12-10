import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const OPEN_CHARS = "([{<";
const CLOSING_CHARS = ")]}>";

const part1 = (rawInput: string) => {
  const SCORES = [3, 57, 1197, 25137];

  const input = parseInput(rawInput);
  let totalScore = 0;
  input.forEach((line) => {
    const openChars: number[] = []; // Lazy stack
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const openCharIndex = OPEN_CHARS.indexOf(char);
      if (openCharIndex !== -1) {
        openChars.push(openCharIndex);
      }

      const closingCharIndex = CLOSING_CHARS.indexOf(char);
      if (closingCharIndex !== -1) {
        if (openChars[openChars.length - 1] !== closingCharIndex) {
          // Syntax error!
          totalScore += SCORES[closingCharIndex];
          return;
        } else {
          openChars.pop();
        }
      }
    }
  });
  return totalScore;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Filter out malformed lines
  const safeLines = input.filter((line) => {
    const openChars: number[] = []; // Lazy stack
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const openCharIndex = OPEN_CHARS.indexOf(char);
      if (openCharIndex !== -1) {
        openChars.push(openCharIndex);
      }

      const closingCharIndex = CLOSING_CHARS.indexOf(char);
      if (closingCharIndex !== -1) {
        if (openChars[openChars.length - 1] !== closingCharIndex) {
          // Syntax error!
          return false;
        } else {
          openChars.pop();
        }
      }
    }
    return true; // Made it without any syntax errors
  });

  const scores = safeLines.map((line) => {
    const openChars: number[] = []; // Lazy stack
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const openCharIndex = OPEN_CHARS.indexOf(char);
      if (openCharIndex !== -1) {
        openChars.push(openCharIndex);
      }

      const closingCharIndex = CLOSING_CHARS.indexOf(char);
      if (closingCharIndex !== -1) {
        openChars.pop();
      }
    }

    const completionChars: number[] = openChars.slice().reverse();
    const SCORES = [1, 2, 3, 4];

    let score = 0;
    completionChars.forEach((charIndex) => {
      score *= 5;
      score += SCORES[charIndex];
    });
    return score;
  });

  // Return median score
  scores.sort((a, b) => b - a);
  return scores[Math.floor(scores.length / 2)];
};

const testInput = `[({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]`;

run({
  part1: {
    tests: [{ input: testInput, expected: 26397 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 288957 }],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true
});
