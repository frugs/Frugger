export enum LaneSpot {
  Gap,
  SmallVehicle,
  LargeVehicle,
}

export const LaneSpotGridSize: { [key in LaneSpot]: number } = {
  [LaneSpot.Gap]: 1,
  [LaneSpot.SmallVehicle]: 2,
  [LaneSpot.LargeVehicle]: 4,
};

export class LaneBlueprints {
  static readonly VeryLowBusySmallVehicleLane = [
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap];

  static readonly VeryLowBusyLargeVehicleLane = [
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap];

  static readonly LowBusySmallLargeVehicleLane = [
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap];

  static readonly MidBusySmallVehicleLane = [
    LaneSpot.SmallVehicle,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap];

  static readonly MidBusySmallLargeVehicleLane = [
    LaneSpot.SmallVehicle,
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap];

  static readonly HighBusySmallLargeVehicleLane = [
    LaneSpot.SmallVehicle,
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.LargeVehicle,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.Gap,
    LaneSpot.SmallVehicle];
}
