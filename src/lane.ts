import { Timer } from 'eventemitter3-timer';
import * as PIXI from 'pixi.js';
import { GRID_UNIT, PLAY_AREA_WIDTH } from './constants';
import Enemy from './enemy';
import Game from './game';
import GameEntity from './game_entity';

export enum LaneSpot {
  Gap,
  SmallVehicle,
  LargeVehicle,
}

export const LaneSpotGridSize: { [key in LaneSpot]: number } = {
  [LaneSpot.Gap]: 1,
  [LaneSpot.SmallVehicle]: 1,
  [LaneSpot.LargeVehicle]: 2,
};

export class Lane extends GameEntity {
  readonly blueprint : Array<LaneSpot>;

  readonly period : number;

  readonly container : PIXI.Container;

  private readonly game : Game;

  private readonly spritesheet: PIXI.Spritesheet;

  constructor(
    laneNumber: number,
    blueprint: Array<LaneSpot>,
    period: number,
    game: Game,
    spritesheet: PIXI.Spritesheet,
  ) {
    const container = new PIXI.Container();
    super(0, (laneNumber) * -GRID_UNIT, container);
    this.blueprint = blueprint;
    this.container = container;
    this.period = period;
    this.game = game;
    this.spritesheet = spritesheet;

    const spawnDelay = Math.random() * 200;
    const spawnEnemies = this.spawnEnemies.bind(this);
    new Timer(spawnDelay).on('end', spawnEnemies).start();
    new Timer(spawnDelay + (this.period / 2)).on('end', spawnEnemies).start();
  }

  spawnEnemies() : void {
    let x = -PLAY_AREA_WIDTH;
    this.blueprint.forEach((laneSpot) => {
      const gridSize = LaneSpotGridSize[laneSpot];
      switch (laneSpot) {
        case LaneSpot.SmallVehicle:
        case LaneSpot.LargeVehicle: {
          const enemy = new Enemy(x, 0, gridSize, this.period, this.spritesheet);
          enemy.spawnIn(this.game, this.container);
          break;
        }
        case LaneSpot.Gap:
        default:
          break;
      }
      x += (PLAY_AREA_WIDTH / this.blueprint.length);
    });
  }
}
