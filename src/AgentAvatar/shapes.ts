/**
 * Silhouettes on a 100 × 100 canvas, kept inside the 8–92 box the volume engine requires. Each one
 * is a recognizable object or creature with one dominant mass that carries the big logo eyes.
 * Outlines wind clockwise and holes counter-clockwise, so the nonzero fill rule cuts the holes.
 */
import type { AvatarDefinition } from 'open-bot-avatar';

import type { AgentAvatarShape } from './type';

type Point = [number, number];

const round = (value: number) => Math.round(value * 100) / 100;

/** Closed polygon with each corner rounded; `t` is the share of each edge the corner uses. */
const roundedPolygon = (vertices: Point[], t: number) => {
  const lerp = (a: Point, b: Point, k: number): Point => [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
  ];
  let d = '';
  for (const [index, corner] of vertices.entries()) {
    const start = lerp(corner, vertices[(index + vertices.length - 1) % vertices.length], t);
    const end = lerp(corner, vertices[(index + 1) % vertices.length], t);
    d += `${index === 0 ? 'M' : 'L'}${round(start[0])} ${round(start[1])}Q${round(corner[0])} ${round(corner[1])} ${round(end[0])} ${round(end[1])}`;
  }
  return `${d}Z`;
};

const hexPath = () =>
  roundedPolygon(
    Array.from({ length: 6 }, (_, index): Point => {
      const angle = -Math.PI / 2 + (index * Math.PI) / 3;
      return [50 + 45 * Math.cos(angle), 50 + 45 * Math.sin(angle)];
    }),
    0.3,
  );

const starPath = () =>
  roundedPolygon(
    Array.from({ length: 10 }, (_, index): Point => {
      const angle = -Math.PI / 2 + (index * Math.PI) / 5;
      const radius = index % 2 === 0 ? 47 : 29.5;
      return [50 + radius * Math.cos(angle), 53 + radius * Math.sin(angle)];
    }),
    0.28,
  );

/** A clockwise ellipse as one closed subpath. */
const ellipse = (cx: number, cy: number, rx: number, ry: number, rotation = 0) =>
  `M${round(cx - rx * Math.cos((rotation * Math.PI) / 180))} ${round(cy - rx * Math.sin((rotation * Math.PI) / 180))}A${rx} ${ry} ${rotation} 1 1 ${round(cx + rx * Math.cos((rotation * Math.PI) / 180))} ${round(cy + rx * Math.sin((rotation * Math.PI) / 180))}A${rx} ${ry} ${rotation} 1 1 ${round(cx - rx * Math.cos((rotation * Math.PI) / 180))} ${round(cy - rx * Math.sin((rotation * Math.PI) / 180))}Z`;

/** The logo's head outline in its own 446 × 469 coordinates. */
const LOGO_HEAD =
  'M125.436 127.784C137.593 75.2061 188.685 39.7239 243.897 47.3418C280.292 52.3634 309.891 74.9284 325.114 105.166C340.495 94.3117 359.563 89.0506 379.298 91.7734C421.81 97.6394 451.315 138.336 445.197 182.672C442.807 199.998 435.329 215.315 424.569 227.198C430.651 244.902 433.934 263.76 433.934 283.327C433.933 385.548 344.373 468.414 233.897 468.414C123.42 468.414 33.8606 385.548 33.8604 283.327C33.8604 277.825 34.1196 272.378 34.628 266.997C10.4918 250.502 -3.60641 220.437 0.802757 188.48C6.92004 144.145 46.3427 112.958 88.8555 118.824C100.518 120.433 111.202 124.663 120.439 130.871C122.087 129.819 123.753 128.791 125.436 127.784Z';

/** The logo fitted to the canvas. */
const LOGO_SCALE = 84 / 469;
const logoX = (value: number) => 50 + (value - 223) * LOGO_SCALE;
const logoY = (value: number) => 8 + value * LOGO_SCALE;

/** The logo's head on the canvas. Its path only uses absolute `M`, `C` and `Z`. */
const lobotPath = () => {
  let isX = true;
  return LOGO_HEAD.replaceAll(/-?\d+(?:\.\d+)?/g, (value) => {
    const mapped = isX ? logoX(Number(value)) : logoY(Number(value));
    isX = !isX;
    return String(round(mapped));
  });
};

/** The two small dots floating above the logo's head. */
const lobotDots = () =>
  [
    [96.5, 79.73, 18.51],
    [352.07, 32.03, 32.03],
  ]
    .map(([x, y, r]) =>
      ellipse(round(logoX(x)), round(logoY(y)), round(r * LOGO_SCALE), round(r * LOGO_SCALE)),
    )
    .join('');

export interface AgentAvatarShapeGeometry {
  /**
   * Silhouette path. One outline (plus holes): the engine inflates a single outline into a soft
   * pillow, while separate parts turn like cylinders and carry large flat eyes off their edge.
   */
  d: string;
  /** Small detached details that float with the face plane, outside the volume. */
  extra?: string;
  /** Eyes: center of the pair and the distance between the two eye centers. */
  eyes: { gap: number; x: number; y: number };
}

export const SHAPE_GEOMETRY: Record<AgentAvatarShape, AgentAvatarShapeGeometry> = {
  bear: {
    d: 'M12 24C12 16 18 11 25 11C30 11 35 14 37 19C41 18 45 17 50 17C55 17 59 18 63 19C65 14 70 11 75 11C82 11 88 16 88 24C88 29 86 33 82 36C86 42 89 49 89 57C89 76 72 89 50 89C28 89 11 76 11 57C11 49 14 42 18 36C14 33 12 29 12 24Z',
    eyes: { gap: 34, x: 50, y: 58 },
  },
  book: {
    d: 'M50 24C58 17 72 14 86 16C89 16 91 18 91 21V76C91 79 89 81 86 81C72 80 59 82 50 89C41 82 28 80 14 81C11 81 9 79 9 76V21C9 18 11 16 14 16C28 14 42 17 50 24Z',
    eyes: { gap: 37, x: 50, y: 50 },
  },
  bowl: {
    d: 'M16 26H84A8 8 0 0 1 92 34V36A8 8 0 0 1 86.8 43.5C85 63 74 78 63 83V87A4 4 0 0 1 59 91H41A4 4 0 0 1 37 87V83C26 78 15 63 13.2 43.5A8 8 0 0 1 8 36V34A8 8 0 0 1 16 26Z',
    eyes: { gap: 31, x: 50, y: 50 },
  },
  bulb: {
    d: 'M50 9C69 9 84 24 84 43C84 55 78 63 71 69C67 72 65 75 65 78V83C65 87 61 90 57 90H43C39 90 35 87 35 83V78C35 75 33 72 29 69C22 63 16 55 16 43C16 24 31 9 50 9Z',
    eyes: { gap: 29, x: 50, y: 42 },
  },
  capsule: {
    d: 'M36 22H64A28 28 0 0 1 64 78H36A28 28 0 0 1 36 22Z',
    eyes: { gap: 38, x: 50, y: 52 },
  },
  cat: {
    d: 'M14 16C14 10 19 9 23 12L39 25C43 24 46 24 50 24C54 24 57 24 61 25L77 12C81 9 86 10 86 16L87 44C89 49 90 54 90 59C90 77 72 89 50 89C28 89 10 77 10 59C10 54 11 49 13 44Z',
    eyes: { gap: 36, x: 50, y: 60 },
  },
  chat: {
    d: 'M26 15H74C84 15 91 22 91 32V56C91 66 84 73 74 73H46L30 87C27 89 24 88 25 84L28 73H26C16 73 9 66 9 56V32C9 22 16 15 26 15Z',
    eyes: { gap: 37, x: 50, y: 44 },
  },
  cloud: {
    d: 'M27 80C15 80 8 71 8 61C8 51 15 44 24 43C25 30 36 20 50 20C60 20 69 26 73 35C84 35 92 45 92 57C92 70 83 80 71 80Z',
    eyes: { gap: 31, x: 52, y: 60 },
  },
  cookie: {
    d: 'M47 10C50 10 53 10 56 11C55 17 59 22 65 22C65 28 70 33 76 32C77 37 82 40 89 39C90 43 90 47 90 50C90 72 72 90 50 90C28 90 10 72 10 50C10 28 25 10 47 10Z',
    eyes: { gap: 34, x: 49, y: 56 },
  },
  face: {
    d: 'M50 12C73 12 90 29 90 51C90 73 73 89 50 89C27 89 10 73 10 51C10 29 27 12 50 12Z',
    eyes: { gap: 36, x: 50, y: 52 },
  },
  frog: {
    d: 'M10 62C10 52 14 44 20 38C18 26 26 16 36 16C42 16 47 19 50 24C53 19 58 16 64 16C74 16 82 26 80 38C86 44 90 52 90 62C90 78 72 88 50 88C28 88 10 78 10 62Z',
    eyes: { gap: 34, x: 50, y: 58 },
  },
  ghost: {
    d: 'M50 9C70 9 86 25 86 45V82C86 88 80 91 75 87C72 84 68 83 65 86C61 90 56 91 53 88C51 86 49 86 47 88C44 91 39 90 35 86C32 83 28 84 25 87C20 91 14 88 14 82V45C14 25 30 9 50 9Z',
    eyes: { gap: 31, x: 50, y: 46 },
  },
  hex: { d: hexPath(), eyes: { gap: 35, x: 50, y: 52 } },
  lobot: { d: lobotPath(), extra: lobotDots(), eyes: { gap: 27, x: 54, y: 58 } },
  magnifier: {
    d: 'M45 8C64 8 80 24 80 43C80 50 78 56 74.5 61.5L88 75C92 79 92 84.5 88.5 88C85 91.5 79.5 92 75.5 88L62 74.5C57 77 51 78 45 78C26 78 10 62 10 43C10 24 26 8 45 8Z',
    eyes: { gap: 30, x: 45, y: 43 },
  },
  mug: {
    d: 'M18 18H68C72 18 75 21 75 25V36H77C86 36 92 43 92 52C92 62 86 68 77 68H75V72C75 82 67 90 57 90H28C18 90 10 82 10 72V26C10 21 13 18 18 18ZM75 45V59H77C81 59 84 56 84 52C84 48 81 45 77 45Z',
    eyes: { gap: 27, x: 42, y: 52 },
  },
  pudding: {
    d: 'M32 15H68C76 15 81 20 82 28L86 65C91 66 92 71 92 75C92 81 88 85 82 85H18C12 85 8 81 8 75C8 71 9 66 14 65L18 28C19 20 24 15 32 15Z',
    eyes: { gap: 29, x: 50, y: 48 },
  },
  robot: {
    d: 'M50 9A7 7 0 0 1 53 22.3V30H74C82 30 87 35 87 43V50H89A3 3 0 0 1 92 53V67A3 3 0 0 1 89 70H87V76C87 84 82 89 74 89H26C18 89 13 84 13 76V70H11A3 3 0 0 1 8 67V53A3 3 0 0 1 11 50H13V43C13 35 18 30 26 30H47V22.3A7 7 0 0 1 50 9Z',
    eyes: { gap: 36, x: 50, y: 61 },
  },
  rocket: {
    d: 'M50 8C54 8 58 10 62 14C74 25 81 39 81 54C81 58 80.5 61 80 64L88 73C91 76 92 79 92 83V85C92 88 89 90 86 88L76 81C74 83 71 84 68 84H63C62 88 57 92 50 92C43 92 38 88 37 84H32C29 84 26 83 24 81L14 88C11 90 8 88 8 85V83C8 79 9 76 12 73L20 64C19.5 61 19 58 19 54C19 39 26 25 38 14C42 10 46 8 50 8Z',
    eyes: { gap: 26, x: 50, y: 53 },
  },
  shield: {
    d: 'M50 9C60 15 72 18 86 18C88 18 88 20 88 22V45C88 66 72 82 50 92C28 82 12 66 12 45V22C12 20 12 18 14 18C28 18 40 15 50 9Z',
    eyes: { gap: 34, x: 50, y: 42 },
  },
  sprout: {
    d: 'M18 42H38C28 38 20 30 17 21C16 17 19 15 22 16C34 18 44 26 49 37C53 25 63 15 77 12C81 11 84 14 83 18C80 29 72 38 62 42H82C87 42 89 46 88 50L81 83C80 88 76 91 71 91H29C24 91 20 88 19 83L12 50C11 46 13 42 18 42Z',
    eyes: { gap: 30, x: 50, y: 65 },
  },
  star: { d: starPath(), eyes: { gap: 29, x: 50, y: 50 } },
  bunny: {
    d: 'M27 12C29 8 34 8 37 12C42 19 44 30 44 40C46 40 48 39.5 50 39.5C52 39.5 54 40 56 40C56 30 58 19 63 12C66 8 71 8 73 12C77 20 76 34 72 45C81 50 88 58 88 67C88 81 71 90 50 90C29 90 12 81 12 67C12 58 19 50 28 45C24 34 23 20 27 12Z',
    eyes: { gap: 31, x: 50, y: 68 },
  },
  tile: {
    d: 'M30 11H70C83 11 89 17 89 30V70C89 83 83 89 70 89H30C17 89 11 83 11 70V30C11 17 17 11 30 11Z',
    eyes: { gap: 35, x: 50, y: 50 },
  },
};

/** Size of the engine's eye placeholder: it only anchors the eye plane, the logo eyes are ours. */
const ENGINE_EYE_SCALE = 1.4;

const definitions = new Map<AgentAvatarShape, AvatarDefinition>();

/** The engine definition of a shape. One object per shape, so its volume is built only once. */
export const getShapeDefinition = (shape: AgentAvatarShape): AvatarDefinition => {
  let definition = definitions.get(shape);
  if (!definition) {
    const { d, eyes } = SHAPE_GEOMETRY[shape];
    definition = {
      body: { path: d },
      eyes: { scale: ENGINE_EYE_SCALE, spacing: eyes.gap, x: eyes.x, y: eyes.y },
      id: shape,
      name: shape,
      version: 1,
    };
    definitions.set(shape, definition);
  }
  return definition;
};
