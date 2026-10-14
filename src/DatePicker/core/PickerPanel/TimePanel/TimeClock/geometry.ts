export const DIAL_SIZE = 224;
export const OUTER_RADIUS = 88;
export const INNER_RADIUS = 58;

const CENTER = DIAL_SIZE / 2;

export interface DialNumber {
  angle: number;
  disabled: boolean;
  inner: boolean;
  label: string;
  value: number;
}

export const pad = (value: number) => String(value).padStart(2, '0');

export const toPosition = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: CENTER + radius * Math.sin(rad), y: CENTER - radius * Math.cos(rad) };
};

export const pointerToPolar = (element: HTMLElement, clientX: number, clientY: number) => {
  const rect = element.getBoundingClientRect();
  const scale = rect.width / DIAL_SIZE || 1;
  const dx = (clientX - (rect.left + rect.width / 2)) / scale;
  const dy = (clientY - (rect.top + rect.height / 2)) / scale;
  const angle = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  return { angle, distance: Math.hypot(dx, dy) };
};

export const isInnerRing = (distance: number) => distance < (OUTER_RADIUS + INNER_RADIUS) / 2;

export const nearestOnCircle = (target: number, candidates: number[], period: number) => {
  let best: number | undefined;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    const raw = Math.abs(candidate - target) % period;
    const distance = Math.min(raw, period - raw);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
};

export const stepCircular = (current: number | null, candidates: number[], direction: 1 | -1) => {
  if (candidates.length === 0) return undefined;
  const sorted = [...candidates].sort((a, b) => a - b);
  if (current === null) return direction === 1 ? sorted[0] : sorted.at(-1);
  if (direction === 1) return sorted.find((value) => value > current) ?? sorted[0];
  return [...sorted].reverse().find((value) => value < current) ?? sorted.at(-1);
};
