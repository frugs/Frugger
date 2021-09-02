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
import { GRID_UNIT } from './constants';

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0xEEEEEE,
  resolution: window.devicePixelRatio || 1,
});
app.stage.y = -128 - GRID_UNIT;

const game = new Game(app.stage);

async function setUp() : Promise<void> {
  const loader = PIXI.Loader.shared;
  const resourcesLoaded = new Promise<void>((resolve) => loader
    .add('assets/frugger_sprites.json')
    .load(() => { resolve(); }));
  await resourcesLoaded;

  const { spritesheet } = loader.resources['assets/frugger_sprites.json'];

  const player = new Player(400, 128, spritesheet, game);
  player.spawnIn(game);

  let stageTween: TWEEN.Tween<PIXI.Container> = null;
  let delay = 100;
  const scrollViewportToDest = (dest: { x: number, y: number }) => {
    if (stageTween != null) {
      stageTween.stop();
    }

    stageTween = new TWEEN.Tween(app.stage)
      .to({ y: 300 - dest.y }, 100)
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
        laneIndex,
        i % 3 === 0
          ? arrayShuffle(LaneBlueprints.LowBusySmallLargeVehicleLane)
          : arrayShuffle(LaneBlueprints.VeryLowBusySmallVehicleLane),
        20000,
        game,
        spritesheet,
      );

      if (Math.floor(i / 2) % 2 === 0) {
        lane.displayObject.scale.x = -1;
        lane.displayObject.x = 800;
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
        laneIndex,
        arrayShuffle(blueprint),
        20000 * 0.9 ** Math.floor(i / 30),
        game,
        spritesheet,
      );

      if (Math.floor(i / 2) % 2 === 0) {
        lane.displayObject.scale.x = -1;
        lane.displayObject.x = 800;
      }
      lane.spawnIn(game);
    }
  }

  for (let i = 0; i < 100; i += 1, laneIndex += 1) {
    // Leave a 3 lane gap between successive lanes
    if (i % 8 !== 0 && i % 8 !== 1 && i % 8 !== 2) {
      const lane = new Lane(
        laneIndex,
        arrayShuffle(LaneBlueprints.HighBusySmallLargeVehicleLane),
        12000 * 0.8 ** Math.floor(i / 20) + 4000 * Math.floor(Math.random() * 3),
        game,
        spritesheet,
      );

      if (i % 16 <= 8) {
        lane.displayObject.scale.x = -1;
        lane.displayObject.x = 800;
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
}
setUp();

document.body.appendChild(app.view);
