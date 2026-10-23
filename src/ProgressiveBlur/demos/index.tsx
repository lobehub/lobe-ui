import { ProgressiveBlur, type ProgressiveBlurProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { frameStyle, Report, scrollStyle } from './data';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      gradientOpacity: { max: 1, min: 0, step: 0.05, value: 0.5 },
      height: { max: 200, min: 16, step: 4, value: 96 },
      layers: { max: 8, min: 1, step: 1, value: 3 },
      maxBlur: { max: 12, min: 0, step: 1, value: 12 },
      mode: {
        options: ['auto', 'blur', 'gradient'],
        value: 'auto',
      },
    },
    { store },
  ) as ProgressiveBlurProps;

  return (
    <StoryBook levaStore={store}>
      <div style={frameStyle}>
        <div style={scrollStyle}>
          <Report />
        </div>
        <ProgressiveBlur {...control} />
      </div>
    </StoryBook>
  );
};
