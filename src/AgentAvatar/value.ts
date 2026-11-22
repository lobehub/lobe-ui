import type { AgentAvatarValue } from './type';
import { AGENT_AVATAR_SHAPES, isAgentAvatarColor } from './utils';

const PREFIX = 'agent-avatar';

/** A choice as one string, for fields that store an avatar as text: `agent-avatar:lobot:geekblue`. */
export const stringifyAgentAvatar = ({ color, shape }: AgentAvatarValue) =>
  `${PREFIX}:${shape}:${color}`;

/** Read a string from `stringifyAgentAvatar`. Anything else returns `undefined`. */
export const parseAgentAvatar = (value?: string | null): AgentAvatarValue | undefined => {
  const [prefix, shape, color, ...others] = value?.split(':') ?? [];
  if (prefix !== PREFIX || others.length > 0) return undefined;
  const validShape = AGENT_AVATAR_SHAPES.find((item) => item === shape);
  return validShape && color && isAgentAvatarColor(color)
    ? { color, shape: validShape }
    : undefined;
};
