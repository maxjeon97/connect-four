"use strict";
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
// (board[5][0] would be the bottom-left spot on the board)

/** makeBoard: fill in global `board`:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  // TODO: add a more detail comment on what this method does
  // other way you can do it is to write two for loops:
  // outer for loop called row, inner for loop pushes "null" to array
  // can also use Array.from
  board.push(...Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(null)));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  // create a column element that is of type "table-row"
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");

  // create the individual head cells and set ids relative to their position
  // also add an event listener that handles clicking on the head cells
  // appends each head cell to the column-top element
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", `top-${x}`);
    headCell.addEventListener("click", handleClick);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    // Create a table row element and assign to a "row" variable
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // Create a table cell element and assign to a "cell" variable
      const cell = document.createElement("td");
      // add an id, c-y-x, to the above table cell element
      cell.setAttribute("id", `c-${y}-${x}`);
      // (for example, for the cell at y=2, x=3, the ID should be "c-2-3")
      // append the table cell to the table row
      row.append(cell);
    }
    // append the row to the html board
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return y coordinate of furthest-down spot
 *    (return null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
// use string template literal instead of the if statement
function placeInTable(y, x) {
  const cellPiece = document.createElement('div');
  cellPiece.classList.add('piece');
  cellPiece.classList.add(`p${currPlayer}`);
  const cell = document.getElementById(`c-${y}-${x}`);
  cell.append(cellPiece);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    // Check four cells to see if they're all legal & all color of current
    // player boolean
    // dont use magic numbers use WIDTH and HEIGHT
    for (let cell of cells) {
      if (cell[0] < 0 || cell[0] > HEIGHT - 1 || cell[1] < 0 || cell[1] > WIDTH - 1) {
        return false;
      }
      if(board[cell[0]][cell[1]] !== currPlayer) {
        return false;
      }
    }
    return true;
  }


  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
  return false;
}

/** endGame: announce game end */
// reenable this later
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = Number(evt.target.id.slice("top-".length));

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // add line to update global `board` variable with new piece
  placeInTable(y, x);
  board[y][x] = currPlayer;
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie: if top row is filled, board is filled
  // refactor to only check top row
  if(board[0].every(x => x !== null)) {
    return endGame("It's a tie!");
  }
  // switch players
  // switch currPlayer 1 <-> 2
  // currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** Start game. */

function start() {
  makeBoard();
  makeHtmlBoard();
}

start();