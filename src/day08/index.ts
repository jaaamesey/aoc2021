import run from "aocrunner";

const parseInput1 = (rawInput: string) => {
  const allOutputValues: string[] = []
  const input = rawInput.split('\n');
  input.forEach((entry) => {
    const [, outputValuesRaw] = entry.split(' | ');
    const outputValues = outputValuesRaw.split(' ');
    outputValues.forEach((val) => allOutputValues.push(val));
  })
  return allOutputValues
};

const parseInput2 = (rawInput: string) => {
  const input = rawInput.split('\n');
  return input.map((entry) => {
    const [signalPatternsRaw, outputValuesRaw] = entry.split(' | ');
    const signalPatterns = signalPatternsRaw.split(' ').map(sortString)
    const outputValues = outputValuesRaw.split(' ').map(sortString)
    return { signalPatterns, outputValues }
  })
};

const SEGMENT_LENGTHS = [6, 2, 5, 4, 4, 5, 6, 3, 7, 6]
const LENGTH_TO_NUMBER = new Map<number, number>();
[1, 4, 7, 8].forEach((n) => {
  LENGTH_TO_NUMBER.set(SEGMENT_LENGTHS[n], n)
})

const part1 = (rawInput: string) => {
  const outputValues = parseInput1(rawInput);
  let count = 0;
  for (const pattern of outputValues) {
    if (!LENGTH_TO_NUMBER.has(pattern.length)) {
      continue;
    }
    count++;
  }
  return count;
};

// This is probably extremely inefficient, but it runs in < 7ms so 🤷
const part2 = (rawInput: string) => {
  const entries = parseInput2(rawInput);
  let outputSum = 0;
  entries.forEach(({ signalPatterns, outputValues }) => {
    const knownValues: string[] = []

    // Fill known number patterns
    signalPatterns.forEach((pattern) => {
      const knownNumber = LENGTH_TO_NUMBER.get(pattern.length);
      if (knownNumber != null) {
        knownValues[knownNumber] = pattern;
      }
    })

    //
    // "a little deduction"
    //

    // 6 = only 6-length number that doesn't contain all parts of 1
    knownValues[6] = signalPatterns.filter((n) => {
      const one = knownValues[1];
      if (n.length !== 6) return false;
      if (n.includes(one[0]) && n.includes(one[1])) return false;
      return true;
    })[0]

    // 3 = only 5-length number that contains all parts of 1
    knownValues[3] = signalPatterns.filter((n) => {
      const one = knownValues[1];
      if (n.length !== 5) return false;
      if (!n.includes(one[0]) || !n.includes(one[1])) return false;
      return true;
    })[0];

    // 5 = only 5-length number that has all its parts inside 6
    knownValues[5] = signalPatterns.filter((n) => {
      const six = knownValues[6];
      if (n.length !== 5) return false;
      for (const char of n) {
        if (!six.includes(char)) return false;
      }
      return true;
    })[0]

    // 2 = only 5-length number that isn't 3 or 5
    knownValues[2] = signalPatterns.filter((n) => {
      if (n.length !== 5) return false;
      if (n === knownValues[3] || n === knownValues[5]) return false;
      return true;
    })[0]

    // 9 = only 6-length number that has all parts of 4 inside it
    knownValues[9] = signalPatterns.filter((n) => {
      const four = knownValues[4];
      if (n.length !== 6) return false;
      for (const char of four) {
        if (!n.includes(char)) return false;
      }
      return true;
    })[0];

    // 0 = only 6-length number that isn't 6 or 9
    knownValues[0] = signalPatterns.filter((n) => {
      if (n.length !== 6) return false;
      if (n === knownValues[6] || n === knownValues[9]) return false;
      return true;
    })[0]

    // All number patterns are known, now it's time to map them and sum the output 😎
    const patternToNumber = new Map<string, number>();
    knownValues.forEach((pattern, number) => patternToNumber.set(pattern, number))

    let output = ''
    outputValues.forEach((val) => {
      val = sortString(val)
      output += patternToNumber.get(val);
      if (patternToNumber.get(val) == null) throw `Couldn't find number for pattern ${val}`
    })
    outputSum += parseInt(output);
  })
  return outputSum;
};

function sortString(str: string) {
  return str.split('').sort().join('');
}

const testInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

run({
  part1: {
    tests: [{ input: testInput, expected: 26 }],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 61229 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  //onlyTests: true,
});
