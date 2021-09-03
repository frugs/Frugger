import { Timer } from 'eventemitter3-timer';
import * as PIXI from 'pixi.js';
import { GRID_UNIT } from './constants';
import Enemy from './enemy';
import Game from './game';
import GameBounds from './game_bounds';
import GameEntity from './game_entity';
import { LaneSpot, LaneSpotGridSize } from './lane_blueprints';

export enum LaneType {
  Top,
  Middle,
  Bottom,
}

const LaneSpriteTextureName: { [key in LaneType]: string } = {
  [LaneType.Top]: 'Lane-Top',
  [LaneType.Middle]: 'Lane-Middle',
  [LaneType.Bottom]: 'Lane-Bottom',
};

export class Lane extends GameEntity {
  readonly blueprint : Array<LaneSpot>;

  readonly period : number;

  readonly container : PIXI.Container;

  private readonly game : Game;

  private readonly gameBounds: GameBounds;

  private readonly spritesheet: PIXI.Spritesheet;

  constructor(
    x: number,
    laneNumber: number,
    laneType: LaneType,
    blueprint: Array<LaneSpot>,
    period: number,
    game: Game,
    gameBounds: GameBounds,
    spritesheet: PIXI.Spritesheet,
  ) {
    const container = new PIXI.Container();
    super(x, (laneNumber) * -GRID_UNIT, container);
    this.blueprint = blueprint;
    this.container = container;
    this.period = period;
    this.game = game;
    this.gameBounds = gameBounds;
    this.spritesheet = spritesheet;

    const baseTexture = spritesheet.textures[LaneSpriteTextureName[laneType]];
    const laneTexture = new PIXI.Texture(
      baseTexture.castToBaseTexture(),
      new PIXI.Rectangle(baseTexture.frame.x + 5, baseTexture.frame.y + 5, 32, 32),
    );
    const laneSprite = new PIXI.TilingSprite(laneTexture, gameBounds.viewportWidth, GRID_UNIT);
    laneSprite.anchor.set(0, 0.5);
    laneSprite.position.y = 5;
    container.addChild(laneSprite);

    const spawnDelay = Math.random() * 200;
    const spawnEnemies = this.spawnEnemies.bind(this);
    new Timer(spawnDelay).on('end', spawnEnemies).start();
    new Timer(spawnDelay + (this.period / 2)).on('end', spawnEnemies).start();
  }

  spawnEnemies() : void {
    let x = -this.gameBounds.playAreaWidth;
    const blueprintGridWidth = this.blueprint.reduce(
      (acc, laneSpot) => acc + LaneSpotGridSize[laneSpot],
      0,
    );

    this.blueprint.forEach((laneSpot) => {
      const gridSize = LaneSpotGridSize[laneSpot];
      const spaceAllocation = this.gameBounds.playAreaWidth * (gridSize / blueprintGridWidth);
      switch (laneSpot) {
        case LaneSpot.SmallVehicle:
        case LaneSpot.LargeVehicle: {
          const enemy = new Enemy(
            x + (spaceAllocation * 0.5),
            0,
            gridSize,
            this.period,
            this.gameBounds,
            this.spritesheet,
          );
          enemy.spawnIn(this.game, this.container);
          break;
        }
        case LaneSpot.Gap:
        default:
          break;
      }
      x += spaceAllocation;
    });
  }
}
