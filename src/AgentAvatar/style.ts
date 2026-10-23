import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const bodyIdle = stylex.keyframes({
  '0%, 100%': { transform: 'scale(1, 1)' },
  '50%': { transform: 'scale(1.015, 0.982)' },
});
const bodyWorking = stylex.keyframes({
  '0%, 100%': { transform: 'translate(0, 0)' },
  '50%': { transform: 'translate(0, -1.6px)' },
});
const bodyWaiting = stylex.keyframes({
  '0%, 100%': { transform: 'rotate(0deg)' },
  '25%': { transform: 'rotate(-4deg)' },
  '75%': { transform: 'rotate(4deg)' },
});
const bodyBlocked = stylex.keyframes({
  '0%, 24%, 100%': { transform: 'translate(0, 0)' },
  '6%': { transform: 'translate(-1.8px, 0)' },
  '12%': { transform: 'translate(1.8px, 0)' },
  '18%': { transform: 'translate(-1px, 0)' },
});
const bodyThinking = stylex.keyframes({
  '0%, 100%': { transform: 'rotate(-2deg)' },
  '50%': { transform: 'rotate(0deg)' },
});
const bodyDone = stylex.keyframes({
  '0%, 32%, 100%': { transform: 'translate(0, 0) scale(1, 1)' },
  '8%': { transform: 'translate(0, 1px) scale(1.05, 0.93)' },
  '18%': { transform: 'translate(0, -5px) scale(0.97, 1.04)' },
  '26%': { transform: 'translate(0, 0.5px) scale(1.04, 0.95)' },
});

const blinkIdle = stylex.keyframes({
  '0%, 30%, 35%, 82%, 87%, 100%': { transform: 'scale(1, 1)' },
  '32.5%, 84.5%': { transform: 'scale(1, 0.08)' },
});
const blinkWorking = stylex.keyframes({
  '0%, 90%, 95%, 100%': { transform: 'scale(1, 1)' },
  '92.5%': { transform: 'scale(1, 0.08)' },
});
const blinkWaiting = stylex.keyframes({
  '0%, 60%, 65%, 100%': { transform: 'scale(1, 1)' },
  '62.5%': { transform: 'scale(1, 0.08)' },
});
const blinkThinking = stylex.keyframes({
  '0%, 45%, 50%, 100%': { transform: 'scale(1, 1)' },
  '47.5%': { transform: 'scale(1, 0.08)' },
});

const gazeIdle = stylex.keyframes({
  '0%, 100%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * 0px), calc(var(--lobe-agent-avatar-gaze) * 1.6px))',
  },
  '18%, 40%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * -3px), calc(var(--lobe-agent-avatar-gaze) * 1px))',
  },
  '62%, 84%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * 3px), calc(var(--lobe-agent-avatar-gaze) * 0.6px))',
  },
});
const gazeWorking = stylex.keyframes({
  '0%, 90%, 100%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * -3.2px), calc(var(--lobe-agent-avatar-gaze) * 3.4px))',
  },
  '40%, 50%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * 3.2px), calc(var(--lobe-agent-avatar-gaze) * 3.4px))',
  },
});
// Kept inside the eye white: the pupil top stays ~15% of the radius below the sclera edge.
const gazeThinking = stylex.keyframes({
  '0%, 100%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * 1.8px), calc(var(--lobe-agent-avatar-gaze) * -3.1px))',
  },
  '50%': {
    transform:
      'translate(calc(var(--lobe-agent-avatar-gaze) * -1px), calc(var(--lobe-agent-avatar-gaze) * -3.4px))',
  },
});

const eyesOpenLate = stylex.keyframes({
  '0%': { opacity: 0 },
  '75%, 100%': { opacity: 1 },
});
const eyesClosedEarly = stylex.keyframes({
  '0%': { opacity: 1 },
  '75%, 100%': { opacity: 0 },
});

const thoughtRise = stylex.keyframes({
  '0%': { opacity: 0, transform: 'translate(0, 6px) scale(0)' },
  '20%': { opacity: 0.95 },
  '25%': { transform: 'translate(0, 2.5px) scale(1)' },
  '70%': { opacity: 0.7, transform: 'translate(0, -3.8px) scale(0.9)' },
  '100%': { opacity: 0, transform: 'translate(0, -8px) scale(0)' },
});

const badgeBounce = stylex.keyframes({
  '0%, 16%, 100%': { transform: 'translate(0, 0)' },
  '8%': { transform: 'translate(0, -2px)' },
});

export const styles = stylex.create({
  badgeDot: {
    fill: cssVar.colorError,
  },
  badgeMark: {
    fill: cssVar.colorTextLightSolid,
  },
  badgeMotion: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationName: { default: badgeBounce, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  badgeRing: {
    fill: cssVar.colorBgContainer,
  },
  blinkIdle: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '6s',
    animationIterationCount: 'infinite',
    animationName: { default: blinkIdle, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  blinkThinking: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: blinkThinking, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  blinkWaiting: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: blinkWaiting, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  blinkWorking: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: blinkWorking, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  body: {
    fill: 'var(--lobe-agent-avatar-color)',
  },
  bodyBlocked: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationName: { default: bodyBlocked, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  bodyDone: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: bodyDone, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  bodyIdle: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: bodyIdle, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  bodyMotion: {
    transformBox: 'view-box',
    transformOrigin: '50px 94px',
  },
  bodyThinking: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: bodyThinking, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  bodyWaiting: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: bodyWaiting, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  bodyWorking: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '0.75s',
    animationIterationCount: 'infinite',
    animationName: { default: bodyWorking, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  eyes: {
    transformBox: 'view-box',
  },
  eyesClosedEarly: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: eyesClosedEarly, [reducedMotion]: 'none' },
    animationTimingFunction: 'steps(1, end)',
  },
  eyesOpenLate: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: eyesOpenLate, [reducedMotion]: 'none' },
    animationTimingFunction: 'steps(1, end)',
  },
  gazeIdle: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '6s',
    animationIterationCount: 'infinite',
    animationName: { default: gazeIdle, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  gazeThinking: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: { default: gazeThinking, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  gazeWorking: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationName: { default: gazeWorking, [reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  pupils: {
    transformBox: 'view-box',
  },
  root: {
    flex: 'none',
    overflow: 'visible',
    display: 'block',
    height: 40,
    width: 40,
  },
  thoughtDot: {
    fill: 'var(--lobe-agent-avatar-color)',
    stroke: cssVar.colorBgContainer,
    strokeWidth: 2.5,
    // A background halo keeps the bubbles readable where they cross ears or corners.
    paintOrder: 'stroke',
    transformBox: 'fill-box',
    transformOrigin: 'center',
  },
  thoughtRise: {
    animationDelay: 'var(--lobe-agent-avatar-delay, 0s)',
    animationDuration: '1.8s',
    animationIterationCount: 'infinite',
    animationName: { default: thoughtRise, [reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
  },
});
