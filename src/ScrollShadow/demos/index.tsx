import { ScrollShadow, type ScrollShadowProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      hideScrollBar: false,
      isEnabled: true,
      offset: 0,
      orientation: {
        options: ['vertical', 'horizontal'],
        value: 'vertical',
      },
      size: 50,
      visibility: {
        options: ['auto', 'always', 'never'],
        value: 'auto',
      },
    },
    { store },
  ) as ScrollShadowProps;

  return (
    <StoryBook levaStore={store}>
      <ScrollShadow
        height={300}
        onVisibilityChange={console.log}
        padding={16}
        width={'100%'}
        {...control}
      >
        {/* 长内容 */}
        {Array.from({ length: 20 })
          .fill(0)
          .map((_, i) => (
            <div key={i} style={{ padding: '8px 0' }}>
              滚动内容示例 {i + 1}
            </div>
          ))}
      </ScrollShadow>
    </StoryBook>
  );
};
