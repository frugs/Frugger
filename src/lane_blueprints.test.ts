import { GRID_UNIT, GAME_WIDTH } from './constants';
import { LaneBlueprints, LaneSpot, LaneSpotGridSize } from './lane_blueprints';

function blueprintWidth(blueprint: Array<LaneSpot>) : number {
  return blueprint.reduce((acc, laneSpot) => acc + LaneSpotGridSize[laneSpot], 0) * GRID_UNIT;
}

test('blueprint width should be less than play area width', () => {
  expect(blueprintWidth(LaneBlueprints.VeryLowBusySmallVehicleLane)).toBeLessThan(GAME_WIDTH);
  expect(blueprintWidth(LaneBlueprints.VeryLowBusyLargeVehicleLane)).toBeLessThan(GAME_WIDTH);
  expect(blueprintWidth(LaneBlueprints.LowBusySmallLargeVehicleLane)).toBeLessThan(GAME_WIDTH);
  expect(blueprintWidth(LaneBlueprints.MidBusySmallVehicleLane)).toBeLessThan(GAME_WIDTH);
  expect(blueprintWidth(LaneBlueprints.MidBusySmallLargeVehicleLane)).toBeLessThan(GAME_WIDTH);
  expect(
    blueprintWidth(LaneBlueprints.HighBusySmallLargeVehicleLane),
  ).toBeLessThan(GAME_WIDTH);
});
