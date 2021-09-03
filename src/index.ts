import { Ticker } from '@pixi/ticker';
import * as TWEEN from '@tweenjs/tween.js';
import arrayShuffle from 'array-shuffle';
import { Timer } from 'eventemitter3-timer';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';
import { GAME_HEIGHT, GRID_UNIT } from './constants';
import Game from './game';
import GameBounds from './game_bounds';
import InteractionController from './interaction_controller';
import Lane from './lane';
import { LaneBlueprints } from './lane_blueprints';
import Player from './player';
import Score from './score';

async function setUp(
  viewportWidth: number, viewportHeight: number, isRotated: boolean,
) : Promise<void> {
  const globalScale = viewportHeight / GAME_HEIGHT;
  const gameBounds = new GameBounds(
    viewportWidth / globalScale, viewportHeight / globalScale, globalScale, isRotated,
  );

  const app = new PIXI.Application({
    width: viewportWidth,
    height: viewportHeight,
    backgroundColor: 0xEEEEEE,
  });
  const viewport = new Viewport({
    screenWidth: viewportWidth,
    screenHeight: viewportHeight,
    worldWidth: gameBounds.viewportWidth,
    worldHeight: gameBounds.viewportHeight,
  });
  viewport.clamp({ direction: 'x' });
  viewport.scale.set(globalScale, globalScale);
  app.stage.addChild(viewport);

  const leftLetterBox = new PIXI.Graphics()
    .beginFill(0x000000, 1)
    .drawRect(0, -100000 / 2, gameBounds.playAreaMinX, 200000)
    .endFill();

  const rightLetterBox = new PIXI.Graphics()
    .beginFill(0x000000, 1)
    .drawRect(
      gameBounds.playAreaMaxX,
      -100000,
      gameBounds.playAreaMinX,
      200000,
    )
    .endFill();

  viewport.addChild(leftLetterBox);
  viewport.addChild(rightLetterBox);

  document.body.appendChild(app.view);

  const game = new Game(viewport);

  const loader = PIXI.Loader.shared;
  const resourcesLoaded = new Promise<void>((resolve) => loader
    .add('assets/frugger_sprites.json')
    .load(() => { resolve(); }));
  await resourcesLoaded;

  const { spritesheet } = loader.resources['assets/frugger_sprites.json'];

  const player = new Player(
    gameBounds.centreX, gameBounds.viewportMinY - GRID_UNIT, spritesheet, game, gameBounds,
  );
  player.spawnIn(game);

  let laneIndex = 1;
  for (let i = 0; i < 25; i += 1, laneIndex += 1) {
  // Leave a 3 lane gap between successive lanes
    if (i % 8 !== 0 && i % 8 !== 1 && i % 8 !== 2) {
      const lane = new Lane(
        gameBounds.playAreaMinX,
        laneIndex,
        i % 3 === 0
          ? arrayShuffle(LaneBlueprints.LowBusySmallLargeVehicleLane)
          : arrayShuffle(LaneBlueprints.VeryLowBusySmallVehicleLane),
        20000,
        game,
        gameBounds,
        spritesheet,
      );

      if (Math.floor(i / 2) % 2 === 0) {
        lane.displayObject.scale.x = -1;
        lane.displayObject.x = gameBounds.playAreaMaxX;
      }
      lane.spawnIn(game);
    }
  }

  for (let i = 0; i < 100; i += 1, laneIndex += 1) {
    // Leave a 3 lane gap between successive lanes
    if (i % 8 !== 0 && i % 8 !== 1 && i % 8 !== 2) {
      const random = Math.random();
      let blueprint = LaneBlueprints.LowBusySmallLargeVehicleLane;

      if (i < 50) {
        if (random < 0.1) {
          blueprint = LaneBlueprints.VeryLowBusyLargeVehicleLane;
        } else if (random < 0.2) {
          blueprint = LaneBlueprints.VeryLowBusySmallVehicleLane;
        } else if (random < 0.4) {
          blueprint = LaneBlueprints.MidBusySmallVehicleLane;
        }
      } else if (random < 0.1) {
        blueprint = LaneBlueprints.HighBusySmallLargeVehicleLane;
      } else if (random < 0.2) {
        blueprint = LaneBlueprints.MidBusySmallLargeVehicleLane;
      } else if (random < 0.4) {
        blueprint = LaneBlueprints.MidBusySmallVehicleLane;
      }

      const lane = new Lane(
        gameBounds.playAreaMinX,
        laneIndex,
        arrayShuffle(blueprint),
        20000 * 0.9 ** Math.floor(i / 30),
        game,
        gameBounds,
        spritesheet,
      );

      if (Math.floor(i / 2) % 2 === 0) {
        lane.displayObject.scale.x = -1;
        lane.displayObject.x = gameBounds.playAreaMaxX;
      }
      lane.spawnIn(game);
    }
  }

  for (let i = 0; i < 100; i += 1, laneIndex += 1) {
    // Leave a 3 lane gap between successive lanes
    if (i % 8 !== 0 && i % 8 !== 1 && i % 8 !== 2) {
      const lane = new Lane(
        gameBounds.playAreaMinX,
        laneIndex,
        arrayShuffle(LaneBlueprints.HighBusySmallLargeVehicleLane),
        12000 * 0.8 ** Math.floor(i / 20) + 4000 * Math.floor(Math.random() * 3),
        game,
        gameBounds,
        spritesheet,
      );

      if (i % 16 <= 8) {
        lane.displayObject.scale.x = -1;
        lane.displayObject.x = gameBounds.playAreaMaxX;
      }
      lane.spawnIn(game);
    }
  }

  Ticker.shared.add(() => {
    Timer.timerManager.update(app.ticker.elapsedMS);
    TWEEN.update();
    player.update();
    Keyboard.update();
  }, PIXI.UPDATE_PRIORITY.HIGH);

  const interactionController = new InteractionController(player, gameBounds);

  // Wait a bit for vehicles before allowing player to move
  new Timer(2000).on('end', () => {
    interactionController.registerInteractionListeners(app);
    viewport.follow(player.displayObject, { speed: 15, acceleration: 1, radius: GRID_UNIT * 0.5 });
  }).start();

  // re-add letterboxes to keep them at the top
  viewport.addChild(leftLetterBox);
  viewport.addChild(rightLetterBox);

  viewport.plugins.add('score', new Score(viewport, player));
}

const landscapeWidth = Math.max(window.innerWidth, window.innerHeight);
const landscapeHeight = Math.min(window.innerWidth, window.innerHeight);
const isRotated = landscapeWidth !== window.innerWidth;
setUp(landscapeWidth, landscapeHeight, isRotated);
