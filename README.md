# Birthday Arcade — Tetris quest 🎂

An Angular 19 standalone app with a retro pixel arcade look. Clear one Tetris line to unlock the cake, click all three candles to light the little crackers, and reveal the birthday message.

## Run locally

Requirements: Node.js 18.19+ (Node 20+ recommended) and npm.

```bash
npm install
npm start
```

Open the local URL printed by Angular CLI (usually http://localhost:4200).

## Run tests (TDD)

```bash
npm test
```

Tests cover board creation, row clearing, collision checks, rotation, game start, candle gating, birthday wish reveal, and finale reset.

## Controls

- **Phone/tablet:** use the on-screen ROTATE, LEFT, DOWN, RIGHT, and DROP PIECE buttons under the board. Each tap performs one action.
- **Keyboard:** ← / → move, ↑ rotate, ↓ move down, Space hard drop.
- The layout adapts to narrow screens, with the board and stats stacked vertically and large touch targets.

## Customize the message

Edit the birthday copy in `src/app/app.component.html`. Styling lives in `src/styles.css`.
