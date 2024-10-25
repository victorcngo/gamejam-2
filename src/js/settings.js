export const RADIUS = 100;
export const HIT_ZONE_POSITION = window.innerWidth * 0.5;
export const PRECISION = 15;
export const hitRangeMaxInPercentage = 200;

// Screen
export const SCREEN_RATIO = (window.innerWidth / 2880)
export const ACCURACY = {
  perfect: 80,
  cool: 70,
  bof: 50
};

export const START_SPEED = 3;
export const HIT_RANGE = [
  HIT_ZONE_POSITION - PRECISION,
  HIT_ZONE_POSITION + PRECISION,
];

export const TIMELINE_Y = window.innerHeight - (SCREEN_RATIO * 200);

export const music = [
    {
        name: "music",
        src: "./assets/audios/GAME_MUSIC.mp3"
    },
]

export const perfect = [
    {
        name: "perfect",
        src: "./assets/audios/perfect.mp3"
    },
]

export const perfectFart = [
    {
        name: "perfectFart",
        src: "./assets/audios/perfect-fart.mp3"
    },
]

export const failedFart = [
    {
        name: "failedFart",
        src: "./assets/audios/failed-fart.mp3"
    },
]
