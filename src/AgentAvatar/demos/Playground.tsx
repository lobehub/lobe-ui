import {
  AGENT_AVATAR_COLORS,
  AGENT_AVATAR_SHAPES,
  AGENT_AVATAR_STATES,
  AgentAvatar,
  type AgentAvatarProps,
} from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const { color, shape, ...control } = useControls(
    {
      animated: true,
      color: { options: ['auto', ...AGENT_AVATAR_COLORS], value: 'auto' },
      seed: 'Writer',
      shape: { options: ['auto', ...AGENT_AVATAR_SHAPES], value: 'auto' },
      size: { max: 160, min: 16, step: 1, value: 96 },
      state: { options: [...AGENT_AVATAR_STATES], value: 'idle' },
    },
    { store },
  ) as Omit<AgentAvatarProps, 'color' | 'shape'> & { color: string; shape: string };

  return (
    <StoryBook levaStore={store}>
      <AgentAvatar
        {...control}
        color={color === 'auto' ? undefined : color}
        shape={shape === 'auto' ? undefined : (shape as AgentAvatarProps['shape'])}
      />
    </StoryBook>
  );
};
