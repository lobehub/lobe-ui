import { MaskShadow, type MaskShadowProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      height: 300,
      position: {
        options: ['bottom', 'top', 'left', 'right'],
        value: 'bottom',
      },
      size: 50,
    },
    { store },
  ) as MaskShadowProps;

  return (
    <StoryBook levaStore={store}>
      <MaskShadow padding={16} width={'100%'} {...control}>
        {/* 长内容 */}
        {Array.from({ length: 20 })
          .fill(0)
          .map((_, i) => (
            <div key={i} style={{ padding: '8px 0' }}>
              滚动内容示例 {i + 1}
            </div>
          ))}
      </MaskShadow>
    </StoryBook>
  );
};
