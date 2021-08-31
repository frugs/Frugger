import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';
import Player from './player';

export default class InteractionController {
  private readonly player: Player;

  public constructor(player: Player) {
    this.player = player;
  }

  public registerInteractionListeners(app: PIXI.Application) : void {
    const { player } = this;
    app.renderer.plugins.interaction.on('pointerdown', this.handlePointerEvent.bind(this));
    Keyboard.events.on('pressed_KeyQ', null, player.moveNW.bind(player));
    Keyboard.events.on('pressed_KeyE', null, player.moveNE.bind(player));
    Keyboard.events.on('pressed_KeyA', null, player.moveSW.bind(player));
    Keyboard.events.on('pressed_KeyD', null, player.moveSE.bind(player));
  }

  private handlePointerEvent(pointerEvent: PIXI.InteractionEvent) : void {
    const { player } = this;
    const { x, y } = pointerEvent.data.global;
    const isLeft = x <= 400;
    const isTop = y <= 300;

    if (isLeft) {
      if (isTop) {
        player.moveNW();
      } else {
        player.moveSW();
      }
    } else if (isTop) {
      player.moveNE();
    } else {
      player.moveSE();
    }
  }
}
