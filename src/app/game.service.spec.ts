import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';

describe('GameService (TDD game rules)', () => {
  let game: GameService;
  beforeEach(() => { TestBed.configureTestingModule({}); game = TestBed.inject(GameService); });
  it('creates an empty 18 by 10 board', () => {
    const board = game.createBoard();
    expect(board.length).toBe(18); expect(board.every(row => row.length === 10 && row.every(cell => cell === null))).toBeTrue();
  });
  it('clears a completed row and adds an empty row at the top', () => {
    const board = game.createBoard(); board[17] = Array(10).fill('#ff4fba');
    const result = game.clearCompletedRows(board);
    expect(result.cleared).toBe(1); expect(result.board[0].every(cell => cell === null)).toBeTrue(); expect(result.board[17].every(cell => cell === null)).toBeTrue();
  });
  it('keeps incomplete rows and reports zero cleared lines', () => {
    const board = game.createBoard(); board[17][0] = '#35e7ff';
    const result = game.clearCompletedRows(board);
    expect(result.cleared).toBe(0); expect(result.board[17][0]).toBe('#35e7ff');
  });
  it('rejects pieces that collide with a filled cell or the board edge', () => {
    const board = game.createBoard(); board[17][3] = '#ff4fba';
    expect(game.canPlace(board, [['#35e7ff']], 3, 17)).toBeFalse();
    expect(game.canPlace(board, [['#35e7ff']], -1, 0)).toBeFalse();
  });
  it('rotates a piece clockwise', () => { expect(game.rotate([['a','b'],['c','d']])).toEqual([['c','a'],['d','b']]); });
});
