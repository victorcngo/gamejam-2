export const RADIUS = 100;
export const HIT_ZONE_POSITION = window.innerWidth / 2;
export const PRECISION = 15;
export const hitRangeMaxInPercentage = 200;

// Screen
export const SCREEN_RATIO = (window.innerWidth / 2880)
export const ACCURACY = {
  perfect: 90,
  good: 80,
  bad: 50
};

export const START_SPEED = 3;
export const HIT_RANGE = [
  HIT_ZONE_POSITION - PRECISION,
  HIT_ZONE_POSITION + PRECISION,
];

export const numOfTargets = 200;
export const TIMELINE_Y = window.innerHeight - (SCREEN_RATIO * 200);
export const iconScale = 2;
