const board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

testList = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const runInterval = () =>
  setInterval(
    () => console.log(board.reverse().map((inner) => inner.reverse())),
    5000
  );

runInterval();
