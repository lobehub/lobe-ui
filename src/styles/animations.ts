import { keyframes } from 'antd-style';

export const maskLeftToRight = keyframes`
  0% {
    mask: linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 150% 0 / 400% no-repeat;
    opacity: 0.2;
  }
  100% {
    mask: linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 0 / 400% no-repeat;
    opacity: 1;
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export type AnimationType = 'fadeIn' | 'mask';

interface ResolveAnimationOptions {
  duration?: number;
  type?: AnimationType;
}

export const resolveAnimationConfig = (
  animated?: boolean,
  options: ResolveAnimationOptions = {},
) => {
  if (!animated) return null;
  const type = options.type ?? 'fadeIn';
  const duration = options.duration ?? 0.5;
  const kf = type === 'fadeIn' ? fadeIn : maskLeftToRight;
  return { cssValue: `${kf} ${duration}s ease-in-out forwards`, duration, type };
};
