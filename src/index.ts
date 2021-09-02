import { Ticker } from '@pixi/ticker';
import * as TWEEN from '@tweenjs/tween.js';
import arrayShuffle from 'array-shuffle';
import { Timer } from 'eventemitter3-timer';
import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';
import Game from './game';
import Lane from './lane';
import { LaneBlueprints } from './lane_blueprints';
import Player from './player';
import InteractionController from './interaction_controller';
import { GAME_HEIGHT, GAME_WIDTH, GRID_UNIT } from './constants';
import GameBounds from './game_bounds';

async function setUp() : Promise<void> {
  const globalScale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
  const gameBounds = new GameBounds(
    window.innerWidth / globalScale, window.innerHeight / globalScale, globalScale,
  );

  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xEEEEEE,
    resolution: window.devicePixelRatio || 1,
  });
  app.stage.scale.set(globalScale, globalScale);
  app.stage.y = -128 - GRID_UNIT;

  const leftLetterBox = new PIXI.Graphics()
    .beginFill(0x000000, 1)
    .drawRect(0, -Number.MAX_SAFE_INTEGER / 2, gameBounds.playAreaMinX, Number.MAX_SAFE_INTEGER)
    .endFill();

  const rightLetterBox = new PIXI.Graphics()
    .beginFill(0x000000, 1)
    .drawRect(
      gameBounds.playAreaMaxX,
      -Number.MAX_SAFE_INTEGER / 2,
      gameBounds.viewportWidth,
      Number.MAX_SAFE_INTEGER,
    )
    .endFill();

  app.stage.addChild(leftLetterBox);
  app.stage.addChild(rightLetterBox);

  document.body.appendChild(app.view);

  const game = new Game(app.stage);

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

  let stageTween: TWEEN.Tween<PIXI.Container> = null;
  let delay = 100;
  const scrollViewportToDest = (dest: { x: number, y: number }) => {
    if (stageTween != null) {
      stageTween.stop();
    }

    stageTween = new TWEEN.Tween(app.stage)
      .to({ y: gameBounds.centreY - dest.y * app.stage.scale.y }, 100)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .delay(delay)
      .onStart(() => { delay -= 10; })
      .onComplete(() => { delay = 100; })
      .start();
  };
  player.on('move', scrollViewportToDest);

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

  const interactionController = new InteractionController(player);

  // Wait a bit for vehicles before allowing player to move
  new Timer(2000).on('end', () => {
    interactionController.registerInteractionListeners(app);
    scrollViewportToDest(player.displayObject.position);
  }).start();

  // re-add letterboxes to keep them at the top
  app.stage.addChild(leftLetterBox);
  app.stage.addChild(rightLetterBox);
}

if (window.innerHeight > window.innerWidth) {
  if (!(window as any).fullScreen) {
    const div = document.createElement('div');
    div.onclick = async () => {
      document.body.removeChild(div);
      await document.body.requestFullscreen();
      await setUp();
    };
    div.textContent = 'This game requires fullscreen. Click for fullscreen.';
    document.body.appendChild(div);
  }
} else {
  setUp();
}
