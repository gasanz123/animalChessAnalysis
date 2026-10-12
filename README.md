# Animal Chess Analysis Board

A lightweight online analysis board inspired by the Lichess analysis layout, using 3D-styled animal pieces.

**Play online:** [Animal Chess Analysis](https://gasanz123.github.io/animalChessAnalysis/)

## Features

- Click-to-move chess analysis board.
- Full unique animal mapping for every piece type.
- FEN input/output for quick position setup.
- Undo and redo support.
- Move list tracking.
- Board flipping.
- Castling support (both sides, both colors).
- Stockfish numerical evaluation panel (score + depth).
- Offline-friendly core board logic (engine eval requires worker network access).

## Piece animals

- 🦁 King
- 🦅 Queen
- 🐘 Rook
- 🦒 Bishop
- 🐎 Knight
- 🐺 Pawn

## Run locally

Because this is a static app, any local static server works:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Tech

- Vanilla HTML/CSS/JavaScript
- Custom in-browser chess move validation and FEN handling logic
- Stockfish web worker integration for evaluation

## Codex PR prerequisites

If Codex cannot create a PR, verify repository integration first:

- `git remote -v` shows a valid remote (for example `origin`).
- The current branch is pushed to the remote.
- The Codex environment has credentials/token permission to create PRs.

Without remote + auth wiring, Codex can still commit locally, but PR creation may fail.

## Smurf Village theme

Select **Smurf Village** in the piece selector, then choose **2D** or **3D**. The selection is saved locally and also appears in the position editor and piece legend.

The set uses Papa Smurf (king), Smurfette (queen), Brainy (bishop), Hefty riding a woodland snail (knight), mushroom houses (rooks), and village Smurfs (pawns). Cream bases identify White and navy bases identify Black; 2D pieces also carry a chess-role badge. Vector artwork and reusable procedural WebGL geometry are bundled locally in `smurfs.js` and `chess3d.js`. No external images or models are downloaded.

Pieces breathe, nod, and wave. Moves hop between squares, castling moves both pieces together, and captures and promotion produce magical sparkles. Check is highlighted. **Pause motion** disables animations; the system reduced-motion setting also disables motion. Changing themes or views, loading a position, flipping, editing, resetting, and undo/redo cancel active movement. If WebGL is unavailable, the theme works in 2D.
