import * as PIXI from 'pixi.js';
import Keyboard from 'pixi.js-keyboard';
import GameBounds from './game_bounds';
import Player from './player';

export default class InteractionController {
  private readonly player: Player;

  private readonly gameBounds: GameBounds;

  public constructor(player: Player, gameBounds: GameBounds) {
    this.player = player;
    this.gameBounds = gameBounds;
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

    const isLeft = this.gameBounds.isRotated
      ? y >= this.gameBounds.centreY * this.gameBounds.globalScale
      : x <= this.gameBounds.centreX * this.gameBounds.globalScale;
    const isTop = this.gameBounds.isRotated
      ? x <= this.gameBounds.centreX * this.gameBounds.globalScale
      : y <= this.gameBounds.centreY * this.gameBounds.globalScale;

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
