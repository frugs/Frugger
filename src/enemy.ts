import * as TWEEN from '@tweenjs/tween.js';
import { Polygon } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { DisplayObject } from 'pixi.js';
import { PLAY_AREA_WIDTH } from './constants';
import GameEntity from './game_entity';

export default class Enemy extends GameEntity {
  dest: { x: number; };

  tween: TWEEN.Tween<DisplayObject>;

  constructor(x: number, y: number, period: number, spritesheet: PIXI.Spritesheet) {
    const sprite = new PIXI.Sprite(spritesheet.textures['SmallVehicle-Idle']);
    sprite.anchor.set(0.5, 0.5);
    super(x, y, sprite, new Polygon(0, 0, [[-15, -15], [15, -15], [-15, 15], [15, 15]]));

    this.dest = { x: x + PLAY_AREA_WIDTH * 2 };
    this.tween = new TWEEN.Tween(this.displayObject)
      .to(this.dest, period)
      .repeat(Infinity)
      .start();
  }
}
