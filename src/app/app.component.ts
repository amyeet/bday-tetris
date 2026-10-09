import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board, Cell, GameService } from './game.service';

@Component({ selector: 'app-root', standalone: true, imports: [CommonModule], templateUrl: './app.component.html' })
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('boardCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  board: Board = this.game.createBoard();
  started = false; unlocked = false; gameOver = false; score = 0; lines = 0;
  candles = [false, false, false];
  showWish = false;
  private piece: Cell[][] = [];
  private x = 3; private y = 0; private color = '#35e7ff';
  private timer: ReturnType<typeof setInterval> | undefined;
  private readonly block = 24;
  constructor(private game: GameService) {}
  ngAfterViewInit(): void { this.draw(); }
  ngOnDestroy(): void { this.stopTimer(); }
  get litCount(): number { return this.candles.filter(Boolean).length; }
  startGame(): void {
    this.stopTimer(); this.board = this.game.createBoard(); this.score = 0; this.lines = 0; this.gameOver = false; this.unlocked = false;
    this.started = true; this.spawn(); this.draw(); this.timer = setInterval(() => this.tick(), 650);
  }
  private spawn(): void {
    const template = this.game.shapes[Math.floor(Math.random() * this.game.shapes.length)];
    this.piece = template.map(row => [...row]); this.color = this.piece.flat().find(Boolean) ?? '#35e7ff'; this.x = Math.floor((this.game.cols - this.piece[0].length) / 2); this.y = 0;
    if (!this.game.canPlace(this.board, this.piece, this.x, this.y)) { this.gameOver = true; this.stopTimer(); }
  }
  get canControl(): boolean { return this.started && !this.gameOver && !this.unlocked; }

  /** Shared control handler for keyboard, touch buttons, and mouse clicks. */
  handleControl(action: 'left' | 'right' | 'rotate' | 'down' | 'drop'): void {
    if (!this.canControl) return;

    if (action === 'left' && this.game.canPlace(this.board, this.piece, this.x - 1, this.y)) this.x--;
    if (action === 'right' && this.game.canPlace(this.board, this.piece, this.x + 1, this.y)) this.x++;
    if (action === 'rotate') {
      const rotated = this.game.rotate(this.piece);
      if (this.game.canPlace(this.board, rotated, this.x, this.y)) this.piece = rotated;
    }
    if (action === 'down') { this.tick(); return; }
    if (action === 'drop') {
      while (this.game.canPlace(this.board, this.piece, this.x, this.y + 1)) this.y++;
      this.lockPiece();
    }
    this.draw();
  }

  @HostListener('window:keydown', ['$event']) onKey(event: KeyboardEvent): void {
    const keyToAction: Record<string, 'left' | 'right' | 'rotate' | 'down' | 'drop'> = {
      ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'rotate', ArrowDown: 'down', ' ': 'drop'
    };
    const action = keyToAction[event.key];
    // Let focused buttons use their native Enter/Space activation without a double move.
    if (event.target instanceof HTMLElement && event.target.closest('button')) return;
    if (!action || !this.canControl) return;
    event.preventDefault();
    this.handleControl(action);
  }
  private tick(): void { if (!this.started || this.gameOver || this.unlocked) return; if (this.game.canPlace(this.board, this.piece, this.x, this.y + 1)) this.y++; else this.lockPiece(); this.draw(); }
  private lockPiece(): void {
    this.piece.forEach((row, sy) => row.forEach((cell, sx) => { const px = this.x + sx, py = this.y + sy; if (cell && py >= 0 && py < this.game.rows && px >= 0 && px < this.game.cols) this.board[py][px] = cell; }));
    const result = this.game.clearCompletedRows(this.board); this.board = result.board;
    if (result.cleared) { this.lines += result.cleared; this.score += result.cleared * 100; this.unlocked = true; this.stopTimer(); }
    else this.spawn();
  }
  lightCandle(index: number): void { if (!this.unlocked) return; this.candles[index] = true; if (this.candles.every(Boolean)) this.showWish = true; }
  resetCandles(): void { this.candles = [false, false, false]; this.showWish = false; }
  private stopTimer(): void { if (this.timer) { clearInterval(this.timer); this.timer = undefined; } }
  private draw(): void {
    const canvas = this.canvasRef?.nativeElement; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#100b2e'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const size = this.block, ox = 10, oy = 10;
    for (let r=0;r<this.game.rows;r++) for(let c=0;c<this.game.cols;c++) this.drawCell(ctx, ox+c*size, oy+r*size, this.board[r][c]);
    if (this.started && !this.gameOver && !this.unlocked) this.piece.forEach((row,sy)=>row.forEach((cell,sx)=>{if(cell)this.drawCell(ctx,ox+(this.x+sx)*size,oy+(this.y+sy)*size,cell as string);}));
  }
  private drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: Cell): void {
    ctx.fillStyle = color ?? '#1e1943'; ctx.fillRect(x+1,y+1,this.block-2,this.block-2);
    if (color) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x+3,y+3,this.block-8,3); }
    ctx.strokeStyle = '#39315f'; ctx.strokeRect(x+1,y+1,this.block-2,this.block-2);
  }
}
