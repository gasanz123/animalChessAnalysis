const boardEl = document.getElementById("board");
const fenInput = document.getElementById("fenInput");
const statusText = document.getElementById("statusText");
const moveListEl = document.getElementById("moveList");

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

const animalMap = {
  k: "🦁",
  q: "🦅",
  r: "🐘",
  b: "🦒",
  n: "🐎",
  p: "🐺",
};

const pieceNames = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

let game = createGame();
const undoStack = [];
const redoStack = [];
let selectedSquare = null;
let legalTargets = [];
let isFlipped = false;

function toSquare(file, rank) {
  return `${files[file]}${8 - rank}`;
}

function fromSquare(square) {
  return { file: files.indexOf(square[0]), rank: 8 - Number(square[1]) };
}

function inBounds(file, rank) {
  return file >= 0 && file < 8 && rank >= 0 && rank < 8;
}

function cloneBoard(board) {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

function createGame() {
  const state = {
    board: Array.from({ length: 8 }, () => Array(8).fill(null)),
    turn: "w",
    castling: "KQkq",
    enPassant: "-",
    halfmove: 0,
    fullmove: 1,
    history: [],
  };

  loadFenIntoState(state, START_FEN);
  return state;
}

function snapshot() {
  return {
    board: cloneBoard(game.board),
    turn: game.turn,
    castling: game.castling,
    enPassant: game.enPassant,
    halfmove: game.halfmove,
    fullmove: game.fullmove,
    history: [...game.history],
  };
}

function restore(state) {
  game.board = cloneBoard(state.board);
  game.turn = state.turn;
  game.castling = state.castling;
  game.enPassant = state.enPassant;
  game.halfmove = state.halfmove;
  game.fullmove = state.fullmove;
  game.history = [...state.history];
}

function loadFenIntoState(state, fen) {
  const [placement, turn, castling, enPassant, halfmove, fullmove] = fen.trim().split(/\s+/);
  if (!placement || !turn) {
    return false;
  }

  const rows = placement.split("/");
  if (rows.length !== 8) {
    return false;
  }

  const nextBoard = Array.from({ length: 8 }, () => Array(8).fill(null));

  for (let rank = 0; rank < 8; rank += 1) {
    let file = 0;
    for (const char of rows[rank]) {
      if (/\d/.test(char)) {
        file += Number(char);
      } else {
        const lower = char.toLowerCase();
        if (!pieceNames[lower] || file > 7) {
          return false;
        }
        nextBoard[rank][file] = {
          type: lower,
          color: char === lower ? "b" : "w",
        };
        file += 1;
      }
    }
    if (file !== 8) {
      return false;
    }
  }

  state.board = nextBoard;
  state.turn = turn === "b" ? "b" : "w";
  state.castling = castling && castling !== "-" ? castling : "";
  state.enPassant = enPassant || "-";
  state.halfmove = Number(halfmove) || 0;
  state.fullmove = Number(fullmove) || 1;
  state.history = [];
  return true;
}

function generateFen() {
  const placement = game.board
    .map((row) => {
      let count = 0;
      let out = "";
      row.forEach((piece) => {
        if (!piece) {
          count += 1;
        } else {
          if (count) out += String(count);
          count = 0;
          out += piece.color === "w" ? piece.type.toUpperCase() : piece.type;
        }
      });
      if (count) out += String(count);
      return out;
    })
    .join("/");

  return `${placement} ${game.turn} ${game.castling || "-"} ${game.enPassant} ${game.halfmove} ${game.fullmove}`;
}

function getPiece(square) {
  const { file, rank } = fromSquare(square);
  return inBounds(file, rank) ? game.board[rank][file] : null;
}

function isSquareAttacked(square, byColor) {
  const { file, rank } = fromSquare(square);

  const pawnDir = byColor === "w" ? -1 : 1;
  for (const deltaFile of [-1, 1]) {
    const f = file + deltaFile;
    const r = rank + pawnDir;
    if (inBounds(f, r)) {
      const p = game.board[r][f];
      if (p && p.color === byColor && p.type === "p") {
        return true;
      }
    }
  }

  const knightOffsets = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ];

  for (const [df, dr] of knightOffsets) {
    const f = file + df;
    const r = rank + dr;
    if (inBounds(f, r)) {
      const p = game.board[r][f];
      if (p && p.color === byColor && p.type === "n") {
        return true;
      }
    }
  }

  const kingOffsets = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  for (const [df, dr] of kingOffsets) {
    const f = file + df;
    const r = rank + dr;
    if (inBounds(f, r)) {
      const p = game.board[r][f];
      if (p && p.color === byColor && p.type === "k") {
        return true;
      }
    }
  }

  const sliders = [
    { dirs: [[1, 0], [-1, 0], [0, 1], [0, -1]], pieces: ["r", "q"] },
    { dirs: [[1, 1], [1, -1], [-1, 1], [-1, -1]], pieces: ["b", "q"] },
  ];

  for (const group of sliders) {
    for (const [df, dr] of group.dirs) {
      let f = file + df;
      let r = rank + dr;
      while (inBounds(f, r)) {
        const p = game.board[r][f];
        if (p) {
          if (p.color === byColor && group.pieces.includes(p.type)) {
            return true;
          }
          break;
        }
        f += df;
        r += dr;
      }
    }
  }

  return false;
}

function findKing(color) {
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = game.board[rank][file];
      if (piece?.type === "k" && piece.color === color) {
        return toSquare(file, rank);
      }
    }
  }
  return null;
}

function inCheck(color) {
  const kingSquare = findKing(color);
  if (!kingSquare) {
    return false;
  }
  return isSquareAttacked(kingSquare, color === "w" ? "b" : "w");
}

function applyMove(move, saveHistory = true) {
  const from = fromSquare(move.from);
  const to = fromSquare(move.to);
  const piece = game.board[from.rank][from.file];

  game.board[to.rank][to.file] = {
    ...piece,
    type: move.promotion || piece.type,
  };
  game.board[from.rank][from.file] = null;

  if (piece.type === "p" || move.captured) {
    game.halfmove = 0;
  } else {
    game.halfmove += 1;
  }

  if (piece.color === "b") {
    game.fullmove += 1;
  }

  game.turn = game.turn === "w" ? "b" : "w";
  game.enPassant = "-";

  if (saveHistory) {
    game.history.push(move.notation);
  }
}

function pseudoMoves(square) {
  const piece = getPiece(square);
  if (!piece || piece.color !== game.turn) {
    return [];
  }

  const { file, rank } = fromSquare(square);
  const moves = [];
  const pushIfValid = (toFile, toRank, continuous = false) => {
    let f = toFile;
    let r = toRank;

    while (inBounds(f, r)) {
      const target = game.board[r][f];
      if (!target) {
        moves.push({ from: square, to: toSquare(f, r) });
      } else {
        if (target.color !== piece.color) {
          moves.push({ from: square, to: toSquare(f, r), captured: true });
        }
        break;
      }

      if (!continuous) {
        break;
      }

      f += Math.sign(f - file);
      r += Math.sign(r - rank);
    }
  };

  if (piece.type === "p") {
    const dir = piece.color === "w" ? -1 : 1;
    const startRank = piece.color === "w" ? 6 : 1;

    if (inBounds(file, rank + dir) && !game.board[rank + dir][file]) {
      const targetRank = rank + dir;
      const to = toSquare(file, targetRank);
      if (targetRank === 0 || targetRank === 7) {
        moves.push({ from: square, to, promotion: "q" });
      } else {
        moves.push({ from: square, to });
      }

      if (rank === startRank && !game.board[rank + dir * 2][file]) {
        moves.push({ from: square, to: toSquare(file, rank + dir * 2) });
      }
    }

    for (const deltaFile of [-1, 1]) {
      const f = file + deltaFile;
      const r = rank + dir;
      if (inBounds(f, r)) {
        const target = game.board[r][f];
        if (target && target.color !== piece.color) {
          const to = toSquare(f, r);
          if (r === 0 || r === 7) {
            moves.push({ from: square, to, captured: true, promotion: "q" });
          } else {
            moves.push({ from: square, to, captured: true });
          }
        }
      }
    }
  }

  if (piece.type === "n") {
    const offsets = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
    offsets.forEach(([df, dr]) => pushIfValid(file + df, rank + dr));
  }

  if (piece.type === "k") {
    const offsets = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    offsets.forEach(([df, dr]) => pushIfValid(file + df, rank + dr));
  }

  if (["b", "r", "q"].includes(piece.type)) {
    const dirs = [];
    if (["b", "q"].includes(piece.type)) {
      dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    }
    if (["r", "q"].includes(piece.type)) {
      dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    }

    dirs.forEach(([df, dr]) => {
      let f = file + df;
      let r = rank + dr;
      while (inBounds(f, r)) {
        const target = game.board[r][f];
        if (!target) {
          moves.push({ from: square, to: toSquare(f, r) });
        } else {
          if (target.color !== piece.color) {
            moves.push({ from: square, to: toSquare(f, r), captured: true });
          }
          break;
        }
        f += df;
        r += dr;
      }
    });
  }

  return moves;
}

function legalMovesForSquare(square) {
  const moves = pseudoMoves(square);
  return moves.filter((move) => {
    const prev = snapshot();
    applyMove({ ...move, notation: "" }, false);
    const safe = !inCheck(prev.turn);
    restore(prev);
    return safe;
  });
}

function allLegalMoves(color = game.turn) {
  const moves = [];
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = game.board[rank][file];
      if (piece && piece.color === color) {
        const square = toSquare(file, rank);
        legalMovesForSquare(square).forEach((move) => moves.push(move));
      }
    }
  }
  return moves;
}

function moveNotation(move) {
  return `${move.from}${move.to}${move.promotion ? "=Q" : ""}`;
}

function makeMove(from, to) {
  const moves = legalMovesForSquare(from);
  const move = moves.find((candidate) => candidate.to === to);
  if (!move) {
    return false;
  }

  undoStack.push(snapshot());
  redoStack.length = 0;
  applyMove({ ...move, notation: moveNotation(move) });
  clearSelection();
  renderBoard();
  updateStatus();
  return true;
}

function orderedBoard() {
  const fileOrder = isFlipped ? [...files].reverse() : files;
  const rankOrder = isFlipped ? [...ranks].reverse() : ranks;
  const squares = [];

  for (const rank of rankOrder) {
    for (const file of fileOrder) {
      squares.push(`${file}${rank}`);
    }
  }

  return squares;
}

function squareColor(fileIndex, rankIndex) {
  return (fileIndex + rankIndex) % 2 === 0 ? "light" : "dark";
}

function renderBoard() {
  boardEl.innerHTML = "";

  orderedBoard().forEach((square) => {
    const fileIndex = files.indexOf(square[0]);
    const rankIndex = ranks.indexOf(Number(square[1]));
    const piece = getPiece(square);

    const squareEl = document.createElement("button");
    squareEl.type = "button";
    squareEl.className = `square ${squareColor(fileIndex, rankIndex)}`;

    if (selectedSquare === square) {
      squareEl.classList.add("selected");
    }

    if (legalTargets.includes(square)) {
      squareEl.classList.add("move-target");
    }

    const showCoord =
      (!isFlipped && square[0] === "a") ||
      (isFlipped && square[0] === "h") ||
      (!isFlipped && square[1] === "1") ||
      (isFlipped && square[1] === "8");

    if (showCoord) {
      const coord = document.createElement("span");
      coord.className = "coord";
      coord.textContent = square[0] === (isFlipped ? "h" : "a") ? square[1] : square[0].toUpperCase();
      squareEl.append(coord);
    }

    if (piece) {
      const pieceEl = document.createElement("div");
      pieceEl.className = `piece ${piece.color === "w" ? "white" : "black"}`;
      pieceEl.textContent = animalMap[piece.type];
      pieceEl.title = `${piece.color === "w" ? "White" : "Black"} ${pieceNames[piece.type]}`;
      squareEl.append(pieceEl);
    }

    squareEl.addEventListener("click", () => handleSquareClick(square));
    boardEl.append(squareEl);
  });
}

function buildMoveList() {
  moveListEl.innerHTML = "";
  for (let i = 0; i < game.history.length; i += 2) {
    const li = document.createElement("li");
    li.textContent = game.history[i + 1] ? `${game.history[i]} ${game.history[i + 1]}` : game.history[i];
    moveListEl.append(li);
  }
}

function updateStatus() {
  fenInput.value = generateFen();
  const legal = allLegalMoves();
  if (legal.length === 0) {
    statusText.textContent = inCheck(game.turn)
      ? `Checkmate — ${game.turn === "w" ? "Black" : "White"} wins.`
      : "Stalemate.";
  } else {
    const color = game.turn === "w" ? "White" : "Black";
    statusText.textContent = `${color} to move${inCheck(game.turn) ? " (check)" : ""}.`;
  }
  buildMoveList();
}

function selectSquare(square) {
  selectedSquare = square;
  legalTargets = legalMovesForSquare(square).map((move) => move.to);
}

function clearSelection() {
  selectedSquare = null;
  legalTargets = [];
}

function handleSquareClick(square) {
  const squarePiece = getPiece(square);
  if (!selectedSquare) {
    if (squarePiece && squarePiece.color === game.turn) {
      selectSquare(square);
    }
  } else if (square === selectedSquare) {
    clearSelection();
  } else if (!makeMove(selectedSquare, square)) {
    if (squarePiece && squarePiece.color === game.turn) {
      selectSquare(square);
    } else {
      clearSelection();
    }
  }
  renderBoard();
}

function loadFen() {
  const fen = fenInput.value.trim();
  const next = snapshot();
  if (!loadFenIntoState(next, fen)) {
    statusText.textContent = "Invalid FEN. Please correct and try again.";
    return;
  }

  undoStack.push(snapshot());
  redoStack.length = 0;
  restore(next);
  clearSelection();
  renderBoard();
  updateStatus();
}

document.getElementById("newGameBtn").addEventListener("click", () => {
  undoStack.push(snapshot());
  redoStack.length = 0;
  game = createGame();
  clearSelection();
  renderBoard();
  updateStatus();
});

document.getElementById("undoBtn").addEventListener("click", () => {
  const previous = undoStack.pop();
  if (previous) {
    redoStack.push(snapshot());
    restore(previous);
    clearSelection();
    renderBoard();
    updateStatus();
  }
});

document.getElementById("redoBtn").addEventListener("click", () => {
  const next = redoStack.pop();
  if (next) {
    undoStack.push(snapshot());
    restore(next);
    clearSelection();
    renderBoard();
    updateStatus();
  }
});

document.getElementById("flipBtn").addEventListener("click", () => {
  isFlipped = !isFlipped;
  renderBoard();
});

document.getElementById("loadFenBtn").addEventListener("click", loadFen);

fenInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    loadFen();
  }
});

renderBoard();
updateStatus();
