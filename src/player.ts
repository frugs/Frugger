import { Sound } from '@pixi/sound';
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

  private readonly jumpSound?: Sound;

  private tween: TWEEN.Tween<DisplayObject>;

  private jumpCounter: number;

  public constructor(
    x: number,
    y: number,
    spritesheet: PIXI.Spritesheet,
    game: Game,
    gameBounds: GameBounds,
    jumpSound?: Sound,
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
    this.jumpSound = jumpSound;
    this.tween = null;
    this.isDead = false;
    this.jumpCounter = 0;
  }

  private get isMoving() : boolean {
    const deltaX = this.dest.x - this.displayObject.x;
    const deltaY = this.dest.y - this.displayObject.y;
    const deltaSquared = deltaX ** 2 + deltaY ** 2;
    return deltaSquared > GRID_UNIT ** 2;
  }

  public moveNW() {
    if (this.isDead) {
      return;
    }

    if (this.isMoving) {
      return;
    }

    const newX = this.dest.x - GRID_UNIT;
    if (newX < this.gameBounds.playAreaMinX) {
      return;
    }

    this.playJumpSound();

    this.dest.x = newX;
    this.dest.y -= GRID_UNIT;
    this.animateMoveToDest();
  }

  public moveNE() {
    if (this.isDead) {
      return;
    }

    if (this.isMoving) {
      return;
    }

    const newX = this.dest.x + GRID_UNIT;
    if (newX > this.gameBounds.playAreaMaxX) {
      return;
    }

    this.playJumpSound();

    this.dest.x = newX;
    this.dest.y -= GRID_UNIT;
    this.animateMoveToDest();
  }

  public moveSW() {
    if (this.isDead) {
      return;
    }

    if (this.isMoving) {
      return;
    }

    const newX = this.dest.x - GRID_UNIT;
    if (newX < this.gameBounds.playAreaMinX) {
      return;
    }

    this.playJumpSound();

    this.dest.x = newX;
    this.dest.y += GRID_UNIT;
    this.animateMoveToDest();
  }

  public moveSE() {
    if (this.isDead) {
      return;
    }

    if (this.isMoving) {
      return;
    }

    const newX = this.dest.x + GRID_UNIT;
    if (newX > this.gameBounds.playAreaMaxX) {
      return;
    }

    this.playJumpSound();

    this.dest.x = newX;
    this.dest.y += GRID_UNIT;
    this.animateMoveToDest();
  }

  private playJumpSound() {
    if (this.jumpCounter % 10 === 0) {
      this.jumpSound?.play();
    }
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

    super.emit('move', this);
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

        super.emit('dead', this);
      }
    });
  }
}
