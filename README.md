# Animal Chess Analysis Board

A lightweight online analysis board inspired by the Lichess analysis layout, using 3D-styled animal pieces.

## Features

- Click-to-move chess analysis board.
- Full unique animal mapping for every piece type.
- FEN input/output for quick position setup.
- Undo and redo support.
- Move list tracking.
- Board flipping.
- Offline-friendly app (no external script/CDN dependency).

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

## Codex PR prerequisites

If Codex cannot create a PR, verify repository integration first:

- `git remote -v` shows a valid remote (for example `origin`).
- The current branch is pushed to the remote.
- The Codex environment has credentials/token permission to create PRs.

Without remote + auth wiring, Codex can still commit locally, but PR creation may fail.
