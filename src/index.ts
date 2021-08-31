import { Ticker } from '@pixi/ticker';
import * as TWEEN from '@tweenjs/tween.js';
import arrayShuffle from 'array-shuffle';
import { Timer } from 'eventemitter3-timer';
import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';
import Game from './game';
import { Lane } from './lane';
import { LowBusySmallVehicleLane, MidBusySmallVehicleLane } from './lane_blueprints';
import Player from './player';
import InteractionController from './interaction_controller';

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0xEEEEEE,
  resolution: window.devicePixelRatio || 1,
});
app.stage.y = 300;

const game = new Game(app.stage);

async function setUp() : Promise<void> {
  const loader = PIXI.Loader.shared;
  const resourcesLoaded = new Promise<void>((resolve) => loader
    .add('assets/frugger_sprites.json')
    .load(() => { resolve(); }));
  await resourcesLoaded;

  const { spritesheet } = loader.resources['assets/frugger_sprites.json'];

  const player = new Player(400, 16, spritesheet, game);
  player.spawnIn(game);

  const interactionController = new InteractionController(player);
  interactionController.registerInteractionListeners(app);

  let stageTween: TWEEN.Tween<PIXI.Container> = null;
  player.on('move', (dest) => {
    if (stageTween != null) {
      stageTween.stop();
    }

    stageTween = new TWEEN.Tween(app.stage)
      .to({ y: 300 - dest.y }, 100)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .delay(100)
      .start();
  });

  for (let i = 1; i < 100; i += 1) {
  // Leave a 3 lane gap between successive lanes
    if (i % 8 !== 0 && i % 8 !== 1 && i % 8 !== 2) {
      const lane = new Lane(
        i,
        i % 3 === 0 ? arrayShuffle(MidBusySmallVehicleLane) : arrayShuffle(LowBusySmallVehicleLane),
        10000 * 0.9 ** Math.floor(i / 20),
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

  Ticker.shared.add(() => {
    Timer.timerManager.update(app.ticker.elapsedMS);
    TWEEN.update();
    player.update();
    Keyboard.update();
  }, PIXI.UPDATE_PRIORITY.HIGH);
}
setUp();

document.body.appendChild(app.view);
