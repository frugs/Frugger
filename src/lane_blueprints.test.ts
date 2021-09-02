import { GRID_UNIT, PLAY_AREA_WIDTH } from './constants';
import { LaneBlueprints, LaneSpot, LaneSpotGridSize } from './lane_blueprints';

function blueprintWidth(blueprint: Array<LaneSpot>) : number {
  return blueprint.reduce((acc, laneSpot) => acc + LaneSpotGridSize[laneSpot], 0) * GRID_UNIT;
}

test('blueprint width should be less than play area width', () => {
  expect(blueprintWidth(LaneBlueprints.VeryLowBusySmallVehicleLane)).toBeLessThan(PLAY_AREA_WIDTH);
  expect(blueprintWidth(LaneBlueprints.VeryLowBusyLargeVehicleLane)).toBeLessThan(PLAY_AREA_WIDTH);
  expect(blueprintWidth(LaneBlueprints.LowBusySmallLargeVehicleLane)).toBeLessThan(PLAY_AREA_WIDTH);
  expect(blueprintWidth(LaneBlueprints.MidBusySmallVehicleLane)).toBeLessThan(PLAY_AREA_WIDTH);
  expect(blueprintWidth(LaneBlueprints.MidBusySmallLargeVehicleLane)).toBeLessThan(PLAY_AREA_WIDTH);
  expect(
    blueprintWidth(LaneBlueprints.HighBusySmallLargeVehicleLane),
  ).toBeLessThan(PLAY_AREA_WIDTH);
});
