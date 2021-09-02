export default class GameBounds {
  playAreaMinX: number;

  playAreaMaxX: number;

  playAreaMinY: number;

  playAreaMaxY: number;

  playAreaWidth: number;

  playAreaHeight: number;

  viewportMinX: number;

  viewportMaxX: number;

  viewportMinY: number;

  viewportMaxY: number;

  viewportWidth: number;

  viewportHeight: number;

  centreX: number;

  centreY: number;

  globalScale: number;

  constructor(viewportWidth: number, viewportHeight: number, globalScale: number) {
    const playAreaWidth = 800;

    this.playAreaMinX = (viewportWidth / 2) - (playAreaWidth / 2);
    this.playAreaMaxX = this.playAreaMinX + playAreaWidth;
    this.playAreaMinY = 0;
    this.playAreaWidth = playAreaWidth;
    this.playAreaMaxY = viewportHeight;
    this.playAreaHeight = viewportHeight;

    this.viewportMinX = 0;
    this.viewportMaxX = viewportWidth;
    this.viewportMinY = 0;
    this.viewportMaxY = viewportHeight;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.centreX = viewportWidth / 2;
    this.centreY = viewportHeight / 2;

    this.globalScale = globalScale;
  }
}
