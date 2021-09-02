import * as TWEEN from '@tweenjs/tween.js';
import { Polygon } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { DisplayObject } from 'pixi.js';
import { GRID_UNIT, PLAY_AREA_WIDTH } from './constants';
import GameEntity from './game_entity';

export default class Enemy extends GameEntity {
  dest: { x: number; };

  tween: TWEEN.Tween<DisplayObject>;

  constructor(
    x: number, y: number, gridSize: number, period: number, spritesheet: PIXI.Spritesheet,
  ) {
    const spriteName = Enemy.selectSpriteNameFromGridSize(gridSize);
    const sprite = new PIXI.Sprite(spritesheet.textures[spriteName]);
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.x = 2;

    const halfWidth = gridSize * GRID_UNIT * 0.5 - 2;
    const halfHeight = GRID_UNIT * 0.5 - 2;
    super(
      x,
      y,
      sprite,
      new Polygon(
        0,
        0,
        [
          [-halfWidth, -halfHeight],
          [halfWidth, -halfHeight],
          [-halfWidth, halfHeight],
          [halfWidth, halfHeight]],
      ),
    );

    this.dest = { x: x + PLAY_AREA_WIDTH * 2 };
    this.tween = new TWEEN.Tween(this.displayObject)
      .to(this.dest, period)
      .repeat(Infinity)
      .start();
  }

  private static selectSpriteNameFromGridSize(gridSize: number) : string {
    switch (gridSize) {
      case 2:
        return 'SmallVehicle-Idle';
      case 4:
        return 'LargeVehicle-Idle';
      default:
        return '';
    }
  }
}
