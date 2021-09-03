import { Plugin, Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import Player from './player';

export default class Score implements Plugin {
  parent: Viewport;

  score: number;

  scoreText: PIXI.Text;

  highScore: number;

  highScoreText: PIXI.Text;

  paused: boolean;

  public constructor(parent: Viewport, player: Player) {
    this.parent = parent;

    this.score = 0;
    this.highScore = 0;

    this.scoreText = new PIXI.Text(this.formatScore(), {
      fontFamily: 'monospace', fill: 'white', stroke: 'black', strokeThickness: 2, fontWeight: 'bold', align: 'right',
    });
    this.parent.addChild(this.scoreText);

    this.highScoreText = new PIXI.Text(this.formatHighScore(), {
      fontFamily: 'monospace', fill: 'yellow', stroke: 'black', strokeThickness: 2, fontWeight: 'bold', align: 'left',
    });
    this.parent.addChild(this.highScoreText);

    this.reset();

    player.on('move', () => {
      this.score = Math.max(this.score, Score.calculateScore(player.dest.y));
      this.highScore = Math.max(this.highScore, this.score);
      this.updateScoreText();
    });

    player.on('dead', () => {
      this.score = 0;
      this.updateScoreText();
    });
  }

  private formatScore(): string {
    return `SCORE: ${this.score.toString().padStart(10, '0')}`;
  }

  private formatHighScore(): string {
    return `HIGH SCORE: ${this.highScore.toString().padStart(10, '0')}`;
  }

  private updateScoreText(): void {
    this.scoreText.text = this.formatScore();
    this.highScoreText.text = this.formatHighScore();
  }

  private static calculateScore(playerDestY: number) : number {
    return Math.floor(playerDestY / 50) * -100;
  }

  destroy(): void {
    this.parent.removeChild(this.scoreText);
    this.parent.removeChild(this.highScoreText);
  }

  // eslint-disable-next-line class-methods-use-this
  down(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  move(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  up(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  wheel(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  resize(): void {}

  // eslint-disable-next-line class-methods-use-this
  reset(): void {
    this.scoreText.position.set(this.parent.right - this.scoreText.width, this.parent.top);
    this.highScoreText.position.set(this.parent.left, this.parent.top);
  }

  // eslint-disable-next-line class-methods-use-this
  pause(): void {}

  // eslint-disable-next-line class-methods-use-this
  resume(): void {}

  // eslint-disable-next-line class-methods-use-this
  update() {}
}
