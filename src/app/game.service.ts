import { Injectable } from '@angular/core';

export type Cell = string | null;
export type Board = Cell[][];

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly cols = 10;
  readonly rows = 18;
  readonly shapes: Cell[][][] = [
    [['#35e7ff','#35e7ff','#35e7ff','#35e7ff']],
    [['#ff4fba','#ff4fba'],['#ff4fba','#ff4fba']],
    [[null,'#ffe45e',null],['#ffe45e','#ffe45e','#ffe45e']],
    [['#a78bfa',null,null],['#a78bfa','#a78bfa','#a78bfa']],
    [[null,null,'#ff9854'],['#ff9854','#ff9854','#ff9854']],
    [[null,'#65f59b','#65f59b'],['#65f59b','#65f59b',null]]
  ];

  createBoard(): Board { return Array.from({ length: this.rows }, () => Array<Cell>(this.cols).fill(null)); }
  clearCompletedRows(board: Board): { board: Board; cleared: number } {
    const remaining = board.filter(row => row.some(cell => cell === null));
    const cleared = this.rows - remaining.length;
    while (remaining.length < this.rows) remaining.unshift(Array<Cell>(this.cols).fill(null));
    return { board: remaining, cleared };
  }
  canPlace(board: Board, shape: Cell[][], x: number, y: number): boolean {
    return shape.every((row, sy) => row.every((cell, sx) => {
      if (!cell) return true;
      const px = x + sx, py = y + sy;
      return px >= 0 && px < this.cols && py < this.rows && (py < 0 || board[py][px] === null);
    }));
  }
  rotate(shape: Cell[][]): Cell[][] { return shape[0].map((_, i) => shape.map(row => row[i]).reverse()); }
}
