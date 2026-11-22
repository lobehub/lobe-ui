import { fireEvent, render, waitFor } from '@testing-library/react';
import { avatarFrame, computePose, validateAvatar } from 'open-bot-avatar';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AgentAvatar from '../AgentAvatar';
import AgentAvatarPicker from '../AgentAvatarPicker';
import { createAgentAvatarTab } from '../createAgentAvatarTab';
import { drawEye, ellipsePath, LOGO_EYE } from '../eyes';
import { REST_YAW, stateLook } from '../look';
import { buildAgentAvatarScene, engineSeed } from '../scene';
import { getShapeDefinition, SHAPE_GEOMETRY } from '../shapes';
import { agentAvatarClasses } from '../stable';
import { buildStillScene } from '../still';
import { stillKey } from '../stillKey';
import { AGENT_AVATAR_STILLS } from '../stills.generated';
import {
  AGENT_AVATAR_COLORS,
  AGENT_AVATAR_SHAPES,
  AGENT_AVATAR_STATES,
  getAgentAvatarTraits,
} from '../utils';
import { parseAgentAvatar, stringifyAgentAvatar } from '../value';

const root = (container: HTMLElement) => container.firstElementChild as SVGSVGElement;
const part = (container: HTMLElement, name: 'badge' | 'body' | 'eyes' | 'thought') =>
  container.querySelector<SVGGElement>(`.${agentAvatarClasses(name)}`);

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

/** First point of an ellipse path, which is its leftmost point. */
const leftOf = (d: string) =>
  d
    .match(/^M(-?[\d.]+) (-?[\d.]+)/)!
    .slice(1)
    .map(Number);

const open = { arc: 0, blink: 0, gazeX: 0, gazeY: 0, slit: 0, squint: 0 };

describe('AgentAvatar', () => {
  let restore: (() => void) | undefined;
  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it('derives the same avatar from the same seed', () => {
    const first = render(<AgentAvatar seed="Writer" />);
    const second = render(<AgentAvatar seed="Writer" />);
    const a = root(first.container);
    const b = root(second.container);

    expect(a.dataset.shape).toBe(b.dataset.shape);
    expect(a.dataset.color).toBe(b.dataset.color);
    expect(part(first.container, 'body')!.children.length).toBe(
      part(second.container, 'body')!.children.length,
    );
    expect(getAgentAvatarTraits('Writer')).toEqual(getAgentAvatarTraits('Writer'));
  });

  it('uses the name as seed and accessible label', () => {
    const { container } = render(<AgentAvatar name="Writer" />);
    const svg = root(container);
    const traits = getAgentAvatarTraits('Writer');

    expect(svg.dataset.shape).toBe(traits.shape);
    expect(svg.dataset.color).toBe(traits.color);
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Writer');
  });

  it('is decorative without a name', () => {
    const { container } = render(<AgentAvatar seed="x" />);
    expect(root(container).getAttribute('aria-hidden')).toBe('true');
    expect(root(container).getAttribute('role')).toBeNull();
  });

  it('spreads seeds over every shape and color', () => {
    const shapes = new Set<string>();
    const colors = new Set<string>();
    for (let index = 0; index < 800; index++) {
      const traits = getAgentAvatarTraits(`agent-${index}`);
      shapes.add(traits.shape);
      colors.add(traits.color);
    }
    expect([...shapes].sort()).toEqual([...AGENT_AVATAR_SHAPES].sort());
    expect([...colors].sort()).toEqual([...AGENT_AVATAR_COLORS].sort());
  });

  it('has valid single-outline geometry for every shape', () => {
    expect(Object.keys(SHAPE_GEOMETRY).sort()).toEqual([...AGENT_AVATAR_SHAPES].sort());
    for (const shape of AGENT_AVATAR_SHAPES) {
      const result = validateAvatar(getShapeDefinition(shape));
      expect(result.ok, `${shape}: ${result.ok ? '' : result.errors.join('; ')}`).toBe(true);
      // Separate parts turn like cylinders and would carry the large eyes off their edge.
      const subpaths = SHAPE_GEOMETRY[shape].d.match(/M/g)!.length;
      expect(subpaths, shape).toBeLessThanOrEqual(shape === 'mug' ? 2 : 1);
    }
  });

  it('applies shape and color overrides', () => {
    const { container } = render(<AgentAvatar color="ink" seed="Writer" shape="cat" />);
    const svg = root(container);

    expect(svg.dataset.shape).toBe('cat');
    expect(svg.dataset.color).toBe('ink');
    expect(svg.style.getPropertyValue('--lobe-agent-avatar-color')).toBe('var(--lobe-gray-11)');
  });

  it('accepts a custom CSS color', () => {
    const { container } = render(<AgentAvatar color="#123456" seed="Writer" />);
    const svg = root(container);
    expect(svg.dataset.color).toBeUndefined();
    expect(svg.style.getPropertyValue('--lobe-agent-avatar-color')).toBe('#123456');
  });

  it('only inlines an explicit size', () => {
    const { container, rerender } = render(<AgentAvatar seed="a" />);
    expect(root(container).style.width).toBe('');

    rerender(<AgentAvatar seed="a" size={24} />);
    expect(root(container).style.width).toBe('24px');
    expect(root(container).style.height).toBe('24px');
  });

  it.each(AGENT_AVATAR_STATES)('renders the %s state on the avatar itself', (state) => {
    const { container } = render(<AgentAvatar seed="Writer" state={state} />);

    expect(root(container).dataset.state).toBe(state);
    expect(part(container, 'badge') !== null).toBe(state === 'blocked');
    expect(part(container, 'thought') !== null).toBe(state === 'thinking');
    expect(part(container, 'eyes')!.children.length).toBe(2);
    expect(part(container, 'body')!.children.length).toBeGreaterThan(0);
  });

  it('never draws effects around the body', () => {
    for (const state of AGENT_AVATAR_STATES) {
      for (const time of [0, 1.3, 2.7, 5.1]) {
        const scene = buildAgentAvatarScene('face', { look: stateLook(state, time), time });
        expect(scene).not.toHaveProperty('back');
        expect(scene).not.toHaveProperty('front');
        expect(scene.body.length).toBeGreaterThan(0);
        expect(scene.eyes).toHaveLength(2);
      }
    }
  });

  it('faces right at rest', () => {
    const definition = getShapeDefinition('face');
    const eye = avatarFrame(definition, {
      reducedMotion: true,
      view: { pitch: 0, yaw: REST_YAW },
    }).shapes.find((item) => item.key === 'eye-0')!;
    // The face plane sits in front of the body, so a right turn moves it right.
    expect(eye.matrix[4]).toBeGreaterThan(0);
  });

  it('widens the eyes and shrinks the pupils when blocked', () => {
    const calm = drawEye(50, 50, 12, -1, open);
    const wide = drawEye(50, 50, 12, -1, { ...open, wide: 1 });
    expect(leftOf(wide.sclera!)[0]).toBeLessThan(leftOf(calm.sclera!)[0]);
    const pupilWidth = (d: string) => Number(d.match(/A([\d.]+)/)![1]);
    expect(pupilWidth(wide.pupil!)).toBeLessThan(pupilWidth(calm.pupil!));
  });

  it('draws the logo eye proportions with the pupils toward the nose', () => {
    const rx = 12;
    const left = drawEye(30, 50, rx, -1, open);
    const right = drawEye(70, 50, rx, 1, open);
    const [scleraX] = leftOf(left.sclera!);
    const [leftPupilX, leftPupilY] = leftOf(left.pupil!);
    const [rightPupilX] = leftOf(right.pupil!);
    const pupilRx = rx * LOGO_EYE.pupilX;

    expect(scleraX).toBeCloseTo(30 - rx, 1);
    expect(leftPupilX + pupilRx).toBeCloseTo(30 + rx * LOGO_EYE.lookIn, 1);
    expect(rightPupilX + pupilRx).toBeCloseTo(70 - rx * LOGO_EYE.lookIn, 1);
    expect(leftPupilY).toBeCloseTo(50 + rx * LOGO_EYE.aspect * LOGO_EYE.lookDown, 1);
  });

  it('keeps the pupil inside the eye white at any gaze', () => {
    const rx = 12;
    const ry = rx * LOGO_EYE.aspect;
    for (let index = 0; index < 32; index++) {
      const angle = (index / 32) * Math.PI * 2;
      for (const side of [-1, 1] as const) {
        const eye = drawEye(50, 50, rx, side, {
          ...open,
          gazeX: Math.cos(angle),
          gazeY: Math.sin(angle),
        });
        const [x, y] = leftOf(eye.pupil!);
        const cx = x + rx * LOGO_EYE.pupilX - 50;
        const cy = y - 50;
        const reach = Math.hypot(
          cx / (rx - rx * LOGO_EYE.pupilX),
          cy / (ry - ry * LOGO_EYE.pupilY),
        );
        expect(reach).toBeLessThanOrEqual(0.95);
      }
    }
  });

  it('closes into a smile and lowers a flat lid', () => {
    const happy = drawEye(50, 50, 12, -1, { ...open, arc: 1 });
    expect(happy.sclera).toBeNull();
    expect(happy.pupil).toBeNull();
    expect(happy.smile).toContain('Q');

    const lidded = drawEye(50, 50, 12, -1, { ...open, slit: 1 });
    expect(lidded.sclera).not.toBe(drawEye(50, 50, 12, -1, open).sclera);
    expect(ellipsePath(50, 50, 10, 10, 70)).toBeNull();
  });

  it('follows the pose of the engine for the blink', () => {
    const definition = getShapeDefinition('face');
    const seed = engineSeed(definition.id);
    const height = (time: number) => {
      const eye = avatarFrame(definition, { time }).shapes.find((item) => item.kind === 'eye')!;
      return eye.kind === 'eye' && eye.mark.shape === 'pill' ? eye.mark.height : 0;
    };
    let rest = 0;
    let blinks = 0;
    for (let time = 0; time < 20; time += 0.02) {
      if (computePose({ reducedMotion: false, seed, time }).blink === 0)
        rest = Math.max(rest, height(time));
    }
    for (let time = 0; time < 20; time += 0.02) {
      const { blink } = computePose({ reducedMotion: false, seed, time });
      if (blink > 0.6) {
        blinks++;
        expect(height(time)).toBeLessThan(rest * 0.75);
      }
    }
    expect(blinks).toBeGreaterThan(0);
  });

  it('draws the detached logo dots with the face', () => {
    expect(buildStillScene('lobot', 'idle').extra).not.toBeNull();
    expect(buildStillScene('lobot', 'blocked').extra).not.toBeNull();
    expect(buildStillScene('face', 'idle').extra).toBeNull();
    expect(
      buildAgentAvatarScene('lobot', { look: stateLook('idle', 0, true), reducedMotion: true })
        .extra,
    ).not.toBeNull();
  });

  it('has a baked still in sync with every shape and the engine', () => {
    for (const shape of AGENT_AVATAR_SHAPES) {
      const still = AGENT_AVATAR_STILLS[shape];
      expect(still.key, `${shape}: run pnpm run generate:agent-avatar`).toBe(stillKey(shape));
      const scene = buildAgentAvatarScene(shape, {
        look: stateLook('idle', 0, true),
        reducedMotion: true,
      });
      expect(
        scene.eyes.map((eye) => eye.transform),
        shape,
      ).toEqual(still.eyes);
    }
  });

  it('keeps ink usable but out of the palette', () => {
    expect(AGENT_AVATAR_COLORS).not.toContain('ink');
    expect(parseAgentAvatar('agent-avatar:lobot:ink')).toEqual({ color: 'ink', shape: 'lobot' });
  });

  it('round-trips the string value', () => {
    const value = { color: 'volcano', shape: 'rocket' } as const;
    expect(stringifyAgentAvatar(value)).toBe('agent-avatar:rocket:volcano');
    expect(parseAgentAvatar('agent-avatar:rocket:volcano')).toEqual(value);
    for (const other of ['🤖', 'https://a.b/c.png', 'agent-avatar:nope:ink', 'agent-avatar:cat']) {
      expect(parseAgentAvatar(other)).toBeUndefined();
    }
    expect(parseAgentAvatar()).toBeUndefined();
  });

  it('picks a shape and a color', () => {
    const onChange = vi.fn();
    const { getByRole, queryByRole } = render(
      <AgentAvatarPicker preview={false} onChange={onChange} />,
    );

    fireEvent.click(getByRole('button', { name: 'Rocket' }));
    expect(onChange).toHaveBeenLastCalledWith({ color: 'geekblue', shape: 'rocket' });
    fireEvent.click(getByRole('button', { name: 'Teal' }));
    expect(onChange).toHaveBeenLastCalledWith({ color: 'cyan', shape: 'rocket' });
    expect(getByRole('button', { name: 'Rocket' }).getAttribute('aria-pressed')).toBe('true');
    expect(queryByRole('button', { name: /use this/i })).toBeNull();
  });

  it('builds an EmojiPicker tab that applies each pick and stays open', () => {
    const tab = createAgentAvatarTab();
    const onPick = vi.fn();
    const { getByRole } = render(<>{tab.render(onPick, 'agent-avatar:cat:green')}</>);

    expect(getByRole('button', { name: 'Cat' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(getByRole('button', { name: 'Rocket' }));
    expect(onPick).toHaveBeenLastCalledWith('agent-avatar:rocket:green', { keepOpen: true });
    expect(tab.renderValue?.('🤖', 40)).toBeUndefined();
    expect(tab.renderValue?.('agent-avatar:cat:green', 40)).toBeTruthy();
  });

  it('is still when animated is false', () => {
    const { container } = render(<AgentAvatar seed="Writer" shape="cookie" state="working" />);
    expect(root(container).dataset.animated).toBeUndefined();
    expect(part(container, 'body')!.querySelector('path')).not.toBeNull();
    expect(container.querySelector('use')).toBeNull();
  });

  it('shows the still pose first, then hands the layers to the painter and back', async () => {
    restore = mockReducedMotion(false);
    const { container, rerender, unmount } = render(
      <AgentAvatar animated seed="Writer" shape="face" />,
    );
    const body = part(container, 'body')!;

    expect(root(container).dataset.animated).toBe('');
    expect(body.querySelector('path')).not.toBeNull();
    await waitFor(() => expect(body.querySelectorAll('use').length).toBeGreaterThan(0));
    expect(body.querySelector(':scope > path')).toBeNull();
    expect(part(container, 'eyes')!.querySelectorAll('path').length).toBeGreaterThanOrEqual(4);

    rerender(<AgentAvatar seed="Writer" shape="face" />);
    expect(root(container).dataset.animated).toBeUndefined();
    expect(body.querySelectorAll('use')).toHaveLength(0);
    expect(body.querySelectorAll('path')).toHaveLength(1);
    expect(container.querySelectorAll('defs path')).toHaveLength(0);
    unmount();
  });

  it('respects prefers-reduced-motion', () => {
    restore = mockReducedMotion(true);
    const { container } = render(<AgentAvatar animated followPointer seed="Writer" state="done" />);

    expect(root(container).dataset.animated).toBeUndefined();
    expect(part(container, 'eyes')!.querySelector('[stroke-linecap="round"]')).not.toBeNull();
  });

  it('forwards class names and styles to the semantic parts', () => {
    const { container } = render(
      <AgentAvatar
        className="root-x"
        classNames={{ badge: 'badge-x', body: 'body-x', eyes: 'eyes-x' }}
        seed="Writer"
        state="blocked"
        styles={{ body: { opacity: 0.5 } }}
      />,
    );

    expect(root(container).classList.contains(agentAvatarClasses.block)).toBe(true);
    expect(root(container).classList.contains('root-x')).toBe(true);
    expect(part(container, 'body')!.classList.contains('body-x')).toBe(true);
    expect(part(container, 'body')!.style.opacity).toBe('0.5');
    expect(container.querySelector('.eyes-x')).not.toBeNull();
    expect(container.querySelector('.badge-x')).not.toBeNull();
  });

  it('switches to the dark token steps in dark mode', () => {
    document.documentElement.dataset.theme = 'dark';
    try {
      const { container } = render(<AgentAvatar color="ink" seed="Writer" />);
      expect(root(container).style.getPropertyValue('--lobe-agent-avatar-color')).toBe(
        'var(--lobe-gray-7)',
      );
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it('derives a stable tilt from the seed', () => {
    const seeds = Array.from({ length: 400 }, (_, index) => `agent-${index}`);
    const tilts = new Set(seeds.map((seed) => getAgentAvatarTraits(seed).tilt));
    expect([...tilts].sort((a, b) => a - b)).toEqual([-3, -2, -1, 0, 1, 2, 3]);

    const seed = seeds.find((item) => getAgentAvatarTraits(item).tilt !== 0)!;
    const { tilt } = getAgentAvatarTraits(seed);
    const { container } = render(<AgentAvatar seed={seed} />);
    expect(root(container).querySelector(':scope > g[transform]')?.getAttribute('transform')).toBe(
      `rotate(${tilt} 50 50)`,
    );
  });

  it('does not tilt when tilt is false or the seeded tilt is zero', () => {
    const seeds = Array.from({ length: 50 }, (_, index) => `agent-${index}`);
    const tilted = seeds.find((seed) => getAgentAvatarTraits(seed).tilt !== 0)!;
    const upright = seeds.find((seed) => getAgentAvatarTraits(seed).tilt === 0)!;

    for (const element of [
      <AgentAvatar key="off" seed={tilted} tilt={false} />,
      <AgentAvatar key="zero" seed={upright} />,
    ]) {
      const { container } = render(element);
      expect(root(container).querySelector(':scope > g[transform]')).toBeNull();
    }
  });

  it('keeps the badge and thought bubbles upright', () => {
    const seed = Array.from({ length: 50 }, (_, index) => `agent-${index}`).find(
      (item) => getAgentAvatarTraits(item).tilt !== 0,
    )!;
    for (const state of ['blocked', 'thinking'] as const) {
      const { container } = render(<AgentAvatar seed={seed} state={state} />);
      const mark = part(container, state === 'blocked' ? 'badge' : 'thought')!;
      expect(mark.parentElement).toBe(root(container));
      expect(mark.querySelector('circle')).not.toBeNull();
    }
  });
});
