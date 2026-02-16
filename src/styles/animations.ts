import { keyframes } from 'antd-style';

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

interface ResolveAnimationOptions {
  duration?: number;
}

export const resolveAnimationConfig = (
  animated?: boolean,
  options: ResolveAnimationOptions = {},
) => {
  if (!animated) return null;
  const duration = options.duration ?? 0.5;
  return { cssValue: `${fadeIn} ${duration}s ease-in-out forwards`, duration };
};
