import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent birthday flow', () => {
  let fixture: ComponentFixture<AppComponent>; let component: AppComponent;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents(); fixture = TestBed.createComponent(AppComponent); component = fixture.componentInstance; fixture.detectChanges(); });
  it('starts locked and reveals the game screen', () => { expect(component.unlocked).toBeFalse(); expect(component.started).toBeFalse(); component.startGame(); expect(component.started).toBeTrue(); expect(component.unlocked).toBeFalse(); });
  it('supports on-screen tap controls after the game starts', () => { component.startGame(); const initialX = (component as any).x; component.handleControl('left'); expect((component as any).x).toBe(initialX - 1); });
  it('ignores tap controls before the game starts', () => { const initialX = (component as any).x; component.handleControl('left'); expect((component as any).x).toBe(initialX); });
  it('only lights candles after a line is cleared', () => { component.lightCandle(0); expect(component.candles[0]).toBeFalse(); component.unlocked = true; component.lightCandle(0); expect(component.candles[0]).toBeTrue(); });
  it('reveals the birthday wish after all three candles are lit', () => { component.unlocked = true; component.lightCandle(0); component.lightCandle(1); expect(component.showWish).toBeFalse(); component.lightCandle(2); expect(component.showWish).toBeTrue(); });
  it('resets the candle finale', () => { component.unlocked = true; component.lightCandle(0); component.lightCandle(1); component.lightCandle(2); component.resetCandles(); expect(component.candles).toEqual([false,false,false]); expect(component.showWish).toBeFalse(); });
});
