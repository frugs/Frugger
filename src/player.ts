import * as TWEEN from '@tweenjs/tween.js';
import { Circle } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { DisplayObject, Ticker } from 'pixi.js';
import Game from './game';
import GameBounds from './game_bounds';
import GameEntity from './game_entity';

const GRID_UNIT = 32;
const MOVE_ANIM_DURATION = 200;

export default class Player extends GameEntity {
  sprite: PIXI.Sprite;

  start: { x: number; y: number };

  dest: { x: number; y: number; };

  isDead: boolean;

  private readonly spritesheet: PIXI.Spritesheet;

  private readonly game: Game;

  private readonly gameBounds: GameBounds;

  private tween: TWEEN.Tween<DisplayObject>;

  public constructor(
    x: number, y: number, spritesheet: PIXI.Spritesheet, game: Game, gameBounds: GameBounds,
  ) {
    const sprite = PIXI.Sprite.from(spritesheet.textures['Frog-Idle']);
    sprite.anchor.set(0.5, 0.5);
    super(x, y, sprite, new Circle(0, 0, 10, gameBounds.globalScale));

    this.sprite = sprite;
    this.start = { x, y };
    this.dest = { x, y };
    this.spritesheet = spritesheet;
    this.game = game;
    this.gameBounds = gameBounds;
    this.tween = null;
    this.isDead = false;
  }

  public moveNW() {
    if (this.isDead) {
      return;
    }

    const newX = this.dest.x - GRID_UNIT;
    if (newX < this.gameBounds.playAreaMinX) {
      return;
    }

    this.dest.x = newX;
    this.dest.y -= GRID_UNIT;
    this.animateMoveToDest();
  }

  public moveNE() {
    if (this.isDead) {
      return;
    }

    const newX = this.dest.x + GRID_UNIT;
    if (newX > this.gameBounds.playAreaMaxX) {
      return;
    }

    this.dest.x = newX;
    this.dest.y -= GRID_UNIT;
    this.animateMoveToDest();
  }

  public moveSW() {
    if (this.isDead) {
      return;
    }

    const newX = this.dest.x - GRID_UNIT;
    if (newX < this.gameBounds.playAreaMinX) {
      return;
    }

    this.dest.x = newX;
    this.dest.y += GRID_UNIT;
    this.animateMoveToDest();
  }

  public moveSE() {
    if (this.isDead) {
      return;
    }

    const newX = this.dest.x + GRID_UNIT;
    if (newX > this.gameBounds.playAreaMaxX) {
      return;
    }

    this.dest.x = newX;
    this.dest.y += GRID_UNIT;
    this.animateMoveToDest();
  }

  private animateMoveToDest() {
    if (this.tween != null) {
      this.tween.stop();
      this.sprite.texture = this.spritesheet.textures['Frog-Idle'];
    }

    Ticker.shared.addOnce(() => {
      this.sprite.texture = this.spritesheet.textures['Frog-Jump'];
    });

    this.tween = new TWEEN.Tween(this.displayObject)
      .to(this.dest, MOVE_ANIM_DURATION)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
      .onComplete(() => {
        this.sprite.texture = this.spritesheet.textures['Frog-Idle'];
        // TODO: Do this somewhere more sensible
        this.isDead = false;
      });

    super.emit('move', this.dest);
  }

  public update() {
    this.game.collidables.forEach((other) => {
      if (other === this) {
        return;
      }

      if (!this.isDead && this.collisionBody.collides(other.collisionBody)) {
        this.dest = { x: this.start.x, y: this.start.y };
        this.animateMoveToDest();
        this.isDead = true;
      }
    });
  }
}
