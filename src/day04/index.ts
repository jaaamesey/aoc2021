import run from "aocrunner";

type Board = number[][]; // 2D array representing board: [row (y)][column (x)]

const parseInput = (rawInput: string) => {
  const [numbersRaw, ...boardsRaw] = rawInput.split("\n\n");
  const boards = boardsRaw.map((boardStr) => {
    const rows = boardStr.split("\n").map((rowStr) =>
      rowStr
        .split(" ")
        .filter((numStr) => numStr.trim() !== "")
        .map((numStr) => parseInt(numStr)),
    );
    return rows as Board;
  });

  return {
    numbers: JSON.parse(`[${numbersRaw}]`) as number[],
    boards,
  };
};

const part1 = (rawInput: string) => {
  return getWinningBoardScore(rawInput, false);
};

const part2 = (rawInput: string) => {
  return getWinningBoardScore(rawInput, true);
};

function getWinningBoardScore(rawInput: string, getLastWinner: boolean) {
  const { numbers, boards } = parseInput(rawInput);
  const drawnNumbers = new Set<number>();
  const winningBoardIndexes = new Set<number>();
  let winningBoardInfo:
    | { index: number; winningNumber: number; markedNumbers: Set<number> }
    | undefined;
  for (const number of numbers) {
    drawnNumbers.add(number);
    boards.forEach((board, boardIndex) => {
      const ROW_LENGTH = board.length;
      const COLUMN_LENGTH = board[0].length;
      for (let row = 0; row < ROW_LENGTH; row++) {
        let rowWins = true;
        for (let column = 0; column < COLUMN_LENGTH; column++) {
          // Traversing row left to right
          const visitedNumber = board[row][column];
          if (!drawnNumbers.has(visitedNumber)) {
            rowWins = false;
          }
        }
        if (
          rowWins &&
          (!winningBoardInfo || getLastWinner) &&
          !winningBoardIndexes.has(boardIndex)
        ) {
          winningBoardInfo = {
            index: boardIndex,
            winningNumber: number,
            markedNumbers: new Set(drawnNumbers),
          };
          winningBoardIndexes.add(boardIndex);
        }
      }

      for (let column = 0; column < COLUMN_LENGTH; column++) {
        let columnWins = true;
        for (let row = 0; row < ROW_LENGTH; row++) {
          // Traversing column up to down
          const visitedNumber = board[row][column];
          if (!drawnNumbers.has(visitedNumber)) {
            columnWins = false;
          }
        }
        if (
          columnWins &&
          (!winningBoardInfo || getLastWinner) &&
          !winningBoardIndexes.has(boardIndex)
        ) {
          winningBoardInfo = {
            index: boardIndex,
            winningNumber: number,
            markedNumbers: new Set(drawnNumbers),
          };
          winningBoardIndexes.add(boardIndex);
        }
      }
    });
  }

  if (winningBoardInfo == null) throw "No board wins";
  const winningBoard = boards[winningBoardInfo.index];
  const { markedNumbers } = winningBoardInfo;
  let sumUnmarkedNumbers = 0;
  winningBoard.forEach((row) =>
    row.forEach((val) => {
      if (!markedNumbers.has(val)) sumUnmarkedNumbers += val;
    }),
  );
  return sumUnmarkedNumbers * winningBoardInfo.winningNumber;
}

const testInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

run({
  part1: {
    tests: [{ input: testInput, expected: 4512 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 1924 }],
    solution: part2,
  },
  trimTestInputs: true,
});
