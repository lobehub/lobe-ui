import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AgentAvatar from '../AgentAvatar';
import { SHAPE_GEOMETRY } from '../shapes';
import { agentAvatarClasses } from '../stable';
import {
  AGENT_AVATAR_COLORS,
  AGENT_AVATAR_SHAPES,
  AGENT_AVATAR_STATES,
  GAZE_UNIT_RADIUS,
  getAgentAvatarTraits,
  PUPIL_RATIO,
  PUPIL_RATIO_SMALL,
  STILL_GAZE,
} from '../utils';

const root = (container: HTMLElement) => container.firstElementChild as SVGSVGElement;
const body = (container: HTMLElement) =>
  container.querySelector<SVGPathElement>(`.${agentAvatarClasses('body')}`)!;

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

describe('AgentAvatar', () => {
  let restore: (() => void) | undefined;
  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it('derives the same shape and color from the same seed', () => {
    const first = render(<AgentAvatar seed="Writer" />);
    const second = render(<AgentAvatar seed="Writer" />);
    const a = root(first.container);
    const b = root(second.container);

    expect(a.dataset.shape).toBe(b.dataset.shape);
    expect(a.dataset.color).toBe(b.dataset.color);
    expect(body(first.container).getAttribute('d')).toBe(body(second.container).getAttribute('d'));
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
    for (let index = 0; index < 400; index++) {
      const traits = getAgentAvatarTraits(`agent-${index}`);
      shapes.add(traits.shape);
      colors.add(traits.color);
    }
    expect([...shapes].sort()).toEqual([...AGENT_AVATAR_SHAPES].sort());
    expect([...colors].sort()).toEqual([...AGENT_AVATAR_COLORS].sort());
  });

  it('applies shape and color overrides', () => {
    const { container } = render(<AgentAvatar color="ink" seed="Writer" shape="cat" />);
    const svg = root(container);

    expect(svg.dataset.shape).toBe('cat');
    expect(svg.dataset.color).toBe('ink');
    expect(body(container).getAttribute('d')).toBe(SHAPE_GEOMETRY.cat.d);
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

  it('shrinks the pupils at 24px and below', () => {
    const { container, rerender } = render(<AgentAvatar seed="a" shape="face" size={64} />);
    const pupilRadius = () => Number(container.querySelector('circle')!.getAttribute('r'));
    const r = SHAPE_GEOMETRY.face.eyes.r;

    expect(pupilRadius()).toBeCloseTo(r * PUPIL_RATIO, 1);
    rerender(<AgentAvatar seed="a" shape="face" size={24} />);
    expect(pupilRadius()).toBeCloseTo(r * PUPIL_RATIO_SMALL, 1);
  });

  it.each(AGENT_AVATAR_STATES)('renders the %s state', (state) => {
    const { container } = render(<AgentAvatar seed="Writer" state={state} />);
    const svg = root(container);

    expect(svg.dataset.state).toBe(state);
    expect(container.querySelector(`.${agentAvatarClasses('eyes')}`)).not.toBeNull();
    expect(container.querySelector(`.${agentAvatarClasses('badge')}`) !== null).toBe(
      state === 'blocked',
    );
    expect(container.querySelector(`.${agentAvatarClasses('thought')}`) !== null).toBe(
      state === 'thinking',
    );
    // `done` closes the eyes into arcs; every other state keeps the pupils.
    expect(container.querySelectorAll('clipPath').length).toBe(state === 'done' ? 0 : 1);
  });

  it('keeps the thinking pupils clear of the top of the eye whites', () => {
    const [x, y] = STILL_GAZE.thinking;
    for (const ratio of [PUPIL_RATIO, PUPIL_RATIO_SMALL]) {
      // Distance between the pupil edge and the sclera edge, as a share of the sclera radius.
      const clearance = 1 - ratio - Math.hypot(x, y) / GAZE_UNIT_RADIUS;
      expect(clearance).toBeGreaterThanOrEqual(0.15);
    }
  });

  it('is still when animated is false', () => {
    const { container } = render(<AgentAvatar seed="Writer" shape="cookie" state="working" />);
    const svg = root(container);

    expect(svg.dataset.animated).toBeUndefined();
    expect(svg.style.getPropertyValue('--lobe-agent-avatar-delay')).toBe('');
    const pupils = container.querySelector('circle')!.parentElement!;
    // Cookie eyes use the reference radius, so the gaze is not rescaled.
    expect(pupils.style.transform).toBe('translate(-2px, 3.4px)');
  });

  it('animates when animated is set and motion is allowed', () => {
    restore = mockReducedMotion(false);
    const { container } = render(<AgentAvatar animated seed="Writer" state="thinking" />);
    const svg = root(container);

    expect(svg.dataset.animated).toBe('');
    expect(svg.style.getPropertyValue('--lobe-agent-avatar-delay')).toMatch(/^-?[\d.]+s$/);
    const dots = container.querySelectorAll<SVGCircleElement>(
      `.${agentAvatarClasses('thought')} circle`,
    );
    expect(dots).toHaveLength(3);
    expect(dots[1].style.animationDelay).toContain('0.35s');
  });

  it('respects prefers-reduced-motion', () => {
    restore = mockReducedMotion(true);
    const { container } = render(<AgentAvatar animated seed="Writer" state="done" />);
    const svg = root(container);

    expect(svg.dataset.animated).toBeUndefined();
    expect(svg.style.getPropertyValue('--lobe-agent-avatar-delay')).toBe('');
    // Only the closed-eye still pose is rendered, without the open eyes it animates from.
    expect(container.querySelectorAll('clipPath')).toHaveLength(0);
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
    expect(body(container).classList.contains('body-x')).toBe(true);
    expect(body(container).style.opacity).toBe('0.5');
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

  it('places the blocked badge inside the canvas for every shape', () => {
    for (const shape of AGENT_AVATAR_SHAPES) {
      const [x, y] = SHAPE_GEOMETRY[shape].badge;
      expect(x + 9).toBeLessThanOrEqual(100);
      expect(y - 9).toBeGreaterThanOrEqual(0);
    }
  });
});
