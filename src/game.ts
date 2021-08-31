import { Container } from 'pixi.js';
import Collidable from './collidable';

export default class Game {
  public stage: Container;

  public collidables: Collidable[];

  constructor(stage: Container) {
    this.stage = stage;
    this.collidables = [];
  }
}
