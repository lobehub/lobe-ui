/**
 * Silhouette and eye geometry on a 100 × 100 canvas. Every silhouette fits the 6–94 box and
 * shares the same construction: a flat body plus the big logo eyes, no mouth, no backing plate.
 */
import type { AgentAvatarShape } from './type';

type Point = [number, number];

const round = (value: number) => Math.round(value * 100) / 100;

const polygon = (points: Point[]) =>
  `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join('L')}Z`;

/** Closed curve sampled from a polar radius function around (cx, cy). */
const polar = (radius: (angle: number) => number, cx = 50, cy = 50, steps = 240) =>
  polygon(
    Array.from({ length: steps }, (_, index) => {
      const angle = (index / steps) * Math.PI * 2;
      const r = radius(angle);
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    }),
  );

const superellipse = (cx: number, cy: number, a: number, b: number, n: number) =>
  polygon(
    Array.from({ length: 120 }, (_, index) => {
      const angle = (index / 120) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        cx + a * Math.sign(cos) * Math.abs(cos) ** (2 / n),
        cy + b * Math.sign(sin) * Math.abs(sin) ** (2 / n),
      ];
    }),
  );

/** The LobeHub logo face: a ball cut flat at the top, with a slightly domed top edge. */
const facePath = () => {
  const r = 44;
  const cx = 50;
  const cy = 40.5;
  const cut = 15.5;
  const fillet = 0.24;
  const inset = 9;
  const a0 = Math.asin((cy - cut) / r);
  const at = (angle: number): Point => [cx + r * Math.cos(angle), cy - r * Math.sin(angle)];
  const [rx, ry] = at(a0 - fillet);
  const [lx, ly] = at(Math.PI - a0 + fillet);
  const hx = Math.sqrt(r * r - (cy - cut) ** 2);
  return `M${round(cx - hx + inset)} ${cut}Q${cx} ${cut - 1.5} ${round(cx + hx - inset)} ${cut}Q${round(cx + hx)} ${cut} ${round(rx)} ${round(ry)}A${r} ${r} 0 1 1 ${round(lx)} ${round(ly)}Q${round(cx - hx)} ${cut} ${round(cx - hx + inset)} ${cut}Z`;
};

/** Flat top with rounded corners and a U-shaped superellipse bottom. */
const bowlPath = () => {
  const n = 2.6;
  const points: string[] = [];
  for (let index = 1; index <= 40; index++) {
    const angle = (index / 40) * Math.PI;
    const cos = Math.cos(angle);
    points.push(
      `${round(50 + 41 * Math.sign(cos) * Math.abs(cos) ** (2 / n))} ${round(52 + 42 * Math.sin(angle) ** (2 / n))}`,
    );
  }
  return `M6 30Q6 14 22 14H78Q94 14 94 30L91 52L${points.join('L')}L6 30Z`;
};

/** Outline of the union of three circles, sampled by casting rays from the center. */
const cloudPath = () => {
  const circles: [number, number, number][] = [
    [34, 54, 30],
    [66, 54, 30],
    [50, 34, 27],
  ];
  const points: Point[] = [];
  for (let index = 0; index < 180; index++) {
    const angle = (index / 180) * Math.PI * 2 - Math.PI / 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let far = 0;
    for (const [cx, cy, r] of circles) {
      const fx = 50 - cx;
      const fy = 50 - cy;
      const b = 2 * (fx * dx + fy * dy);
      const disc = b * b - 4 * (fx * fx + fy * fy - r * r);
      if (disc >= 0) far = Math.max(far, (-b + Math.sqrt(disc)) / 2);
    }
    points.push([50 + far * dx, 50 + far * dy]);
  }
  return polygon(points);
};

const hexPath = () => {
  const vertices = Array.from({ length: 6 }, (_, index): Point => {
    const angle = Math.PI / 6 + (index * Math.PI) / 3;
    return [50 + 44 * Math.cos(angle), 50 + 44 * Math.sin(angle)];
  });
  const lerp = (a: Point, b: Point, t: number): Point => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  let d = '';
  for (const [index, corner] of vertices.entries()) {
    const start = lerp(corner, vertices[(index + 5) % 6], 0.22);
    const end = lerp(corner, vertices[(index + 1) % 6], 0.22);
    d += `${index === 0 ? 'M' : 'L'}${round(start[0])} ${round(start[1])}Q${round(corner[0])} ${round(corner[1])} ${round(end[0])} ${round(end[1])}`;
  }
  return `${d}Z`;
};

const ghostPath = () => {
  let d = 'M14 42A36 36 0 0 1 86 42V84';
  for (let index = 0; index < 3; index++) d += `A12 9 0 0 1 ${86 - (index + 1) * 24} 84`;
  return `${d}Z`;
};

export interface AgentAvatarShapeGeometry {
  /**
   * Centre of the `blocked` badge. Picked per shape so the badge never sits on a feature
   * (cat ears, star points) and stays inside the 100×100 canvas.
   */
  badge: Point;
  /** Silhouette path. */
  d: string;
  /** Eyes: center height, sclera radius and the distance between the two eye centers. */
  eyes: { gap: number; r: number; y: number };
  /** Anchor of the `thinking` thought bubbles (bottom-left dot). */
  thought: Point;
}

export const SHAPE_GEOMETRY: Record<AgentAvatarShape, AgentAvatarShapeGeometry> = {
  bowl: { badge: [91, 9], d: bowlPath(), eyes: { gap: 34, r: 16, y: 46 }, thought: [70, 2] },
  capsule: {
    badge: [88, 14],
    d: 'M36 20H64A30 30 0 0 1 64 80H36A30 30 0 0 1 36 20Z',
    eyes: { gap: 34, r: 16, y: 49 },
    thought: [70, 2],
  },
  cat: {
    badge: [91, 26],
    d: 'M12 57A38 38 0 1 1 88 57A38 38 0 1 1 12 57ZM19 40L17 12Q17 6 22.5 8.5L44 21ZM56 21L77.5 8.5Q83 6 83 12L81 40Z',
    eyes: { gap: 30, r: 14, y: 56 },
    thought: [70, 2],
  },
  cloud: { badge: [88, 14], d: cloudPath(), eyes: { gap: 34, r: 16, y: 52 }, thought: [70, 2] },
  cookie: {
    badge: [89, 9],
    d: polar((angle) => 39.5 + 4.5 * Math.abs(Math.cos(5 * angle)) ** 0.55, 50, 50, 400),
    eyes: { gap: 31, r: 14.5, y: 48 },
    thought: [70, 2],
  },
  face: { badge: [91, 9], d: facePath(), eyes: { gap: 34, r: 16, y: 42 }, thought: [70, 2] },
  ghost: { badge: [90, 13], d: ghostPath(), eyes: { gap: 29, r: 13.5, y: 46 }, thought: [70, 2] },
  hex: { badge: [89, 13], d: hexPath(), eyes: { gap: 27, r: 12.5, y: 47 }, thought: [70, 2] },
  pudding: {
    badge: [91, 12],
    d: 'M30 14H70Q79 14 81 23Q87 50 93 80Q95 92 83 92H17Q5 92 7 80Q13 50 19 23Q21 14 30 14Z',
    eyes: { gap: 29, r: 13.5, y: 52 },
    thought: [70, 2],
  },
  shield: {
    badge: [91, 12],
    d: 'M18 18Q18 8 28 8H72Q82 8 82 18L88 48Q90 72 50 94Q10 72 12 48Z',
    eyes: { gap: 26, r: 12, y: 42 },
    thought: [70, 2],
  },
  star: {
    badge: [88, 14],
    d: polar((angle) => 45 * (0.76 + 0.24 * Math.abs(Math.cos(2 * angle)) ** 2.2)),
    eyes: { gap: 27, r: 12.5, y: 49 },
    thought: [70, 2],
  },
  tile: {
    badge: [91, 9],
    d: superellipse(50, 50, 42, 42, 5),
    eyes: { gap: 33, r: 15.5, y: 46 },
    thought: [70, 2],
  },
};

/** Share of the sclera bottom shaved off by the cheek, as in the logo. */
const CHEEK = 0.74;

/** Eye white: a circle whose bottom is cut by a shallow arc. */
export const scleraPath = (x: number, y: number, r: number) => {
  const cut = y + r * CHEEK;
  const half = Math.sqrt(r * r - (r * CHEEK) ** 2);
  return `M${round(x - half)} ${round(cut)}A${r} ${r} 0 1 1 ${round(x + half)} ${round(cut)}Q${round(x)} ${round(cut - r * 0.2)} ${round(x - half)} ${round(cut)}Z`;
};

/** Closed "smiling" eye arc used by the `done` state. */
export const happyEyePath = (x: number, y: number, r: number) => {
  const k = r / 14.5;
  return `M${round(x - 9.5 * k)} ${round(y + 4 * k)}Q${round(x)} ${round(y - 10 * k)} ${round(x + 9.5 * k)} ${round(y + 4 * k)}`;
};
