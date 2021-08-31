import * as COLLISIONS from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { EventEmitter } from 'eventemitter3';
import Collidable from './collidable';
import Game from './game';

export default abstract class GameEntity extends EventEmitter implements Collidable {
  displayObject: PIXI.DisplayObject;

  private cachedCollisionBody?: COLLISIONS.Body;

  constructor(
    x: number, y: number, displayObject: PIXI.DisplayObject, collisionBody?: COLLISIONS.Body,
  ) {
    super();
    this.displayObject = displayObject;
    this.displayObject.position.set(x, y);

    if (collisionBody != null) {
      this.cachedCollisionBody = collisionBody;
    }
  }

  spawnIn(game: Game, parent?: PIXI.Container) {
    let container = parent;
    if (container == null) {
      container = game.stage;
    }

    container.addChild(this.displayObject);

    if (this.cachedCollisionBody != null) {
      game.collidables.push(this);
    }
  }

  public get collisionBody(): COLLISIONS.Body {
    const { x, y } = (this.displayObject as any).getGlobalPosition();
    this.cachedCollisionBody.x = x;
    this.cachedCollisionBody.y = y;
    return this.cachedCollisionBody;
  }
}
