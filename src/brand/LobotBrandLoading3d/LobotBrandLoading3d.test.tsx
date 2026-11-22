import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { buildAgentAvatarScene } from '@/AgentAvatar/scene';

import { loadingBubbles, loadingLook, LOOP_SECONDS } from './choreography';
import LobotBrandLoading3d from './LobotBrandLoading3d';
import { brandLobotBrandLoading3dClasses } from './stable';

const mockReducedMotion = (matches: boolean) => {
  const original = window.matchMedia;
  window.matchMedia = vi.fn((query: string) => ({
    addEventListener: () => {},
    addListener: () => {},
    dispatchEvent: () => false,
    matches: query === '(prefers-reduced-motion: reduce)' && matches,
    media: query,
    onchange: null,
    removeEventListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
};

const part = (container: HTMLElement, name: 'body' | 'bubbles' | 'eyes') =>
  container.querySelector<SVGGElement>(`.${brandLobotBrandLoading3dClasses(name)}`)!;

const moments = Array.from({ length: 161 }, (_, index) => (index * LOOP_SECONDS) / 160);

describe('LobotBrandLoading3d choreography', () => {
  test('starts and ends on the resting logo', () => {
    for (const time of [0, LOOP_SECONDS, 3 * LOOP_SECONDS]) {
      const look = loadingLook(time);
      expect(look.lift).toBeCloseTo(0, 5);
      expect(look.sy).toBeCloseTo(1, 5);
      expect(look.sx).toBeCloseTo(1, 5);
      expect(look.yaw).toBeCloseTo(0, 5);
      expect(look.arc).toBeCloseTo(0, 5);
    }
    const [small, large] = loadingBubbles(0);
    expect([small.x, small.y, small.r].map((value) => Math.round(value * 10) / 10)).toEqual([
      27.3, 22.3, 3.3,
    ]);
    expect([large.x, large.y, large.r].map((value) => Math.round(value * 10) / 10)).toEqual([
      73.1, 13.7, 5.7,
    ]);
  });

  test('turns the head once around while it is in the air', () => {
    const yaws = moments.map((time) => loadingLook(time).yaw);
    expect(Math.max(...yaws)).toBeGreaterThan(Math.PI * 1.9);
    const back = moments.find((time) => Math.abs(loadingLook(time).yaw - Math.PI) < 0.2)!;
    expect(loadingLook(back).lift).toBeLessThan(-6);
    // Seen from behind there are no eyes to draw.
    expect(buildAgentAvatarScene('lobot', { look: loadingLook(back), time: back }).eyes).toEqual(
      [],
    );
  });

  test('moves without a jump from one frame to the next', () => {
    let previous = loadingLook(0);
    let [a] = loadingBubbles(0);
    for (const time of moments.slice(1)) {
      const look = loadingLook(time);
      expect(Math.abs(look.lift - previous.lift)).toBeLessThan(1.2);
      expect(Math.abs(look.sy - previous.sy)).toBeLessThan(0.05);
      const [next] = loadingBubbles(time);
      expect(Math.hypot(next.x - a.x, next.y - a.y)).toBeLessThan(6);
      previous = look;
      a = next;
    }
  });

  test('keeps the bubbles inside the box', () => {
    // The stage scales the canvas by 0.88 about (50, 92) and rests it on y = 95.
    for (const time of moments) {
      for (const { r, x, y } of loadingBubbles(time)) {
        expect(95 + (y - r - 92) * 0.88).toBeGreaterThan(0);
        expect(50 + (x - r - 50) * 0.88).toBeGreaterThan(0);
        expect(50 + (x + r - 50) * 0.88).toBeLessThan(100);
      }
    }
  });
});

describe('LobotBrandLoading3d', () => {
  let restore: (() => void) | undefined;
  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  test('renders the still mark first and under reduced motion', () => {
    restore = mockReducedMotion(true);
    const { container } = render(<LobotBrandLoading3d />);
    const root = container.firstElementChild!;
    expect(root.classList.contains(brandLobotBrandLoading3dClasses())).toBe(true);
    expect(root.getAttribute('width')).toBe('64');
    expect(root.hasAttribute('data-animated')).toBe(false);
    expect(part(container, 'body').querySelectorAll('path')).toHaveLength(1);
    expect(part(container, 'bubbles').querySelectorAll('path')).toHaveLength(1);
    expect(part(container, 'eyes').children).toHaveLength(2);
    expect(container.querySelector('use')).toBeNull();
  });

  test('hands the layers to the volume engine when motion is allowed', async () => {
    restore = mockReducedMotion(false);
    const { container, unmount } = render(<LobotBrandLoading3d size={120} />);
    expect(container.firstElementChild!.hasAttribute('data-animated')).toBe(true);
    await waitFor(() => expect(part(container, 'body').querySelector('use')).toBeTruthy());
    expect(part(container, 'body').querySelector('path')).toBeNull();
    expect(part(container, 'bubbles').querySelectorAll('circle')).toHaveLength(2);
    expect(part(container, 'eyes').querySelector('path')!.getAttribute('fill')).toBe(
      'var(--lobe-lobot-loading-sclera)',
    );
    unmount();
  });
});
