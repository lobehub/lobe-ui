import { Highlighter, HighlighterProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { code } from './data';

export default () => {
  const store = useCreateStore();
  const options: HighlighterProps | any = useControls(
    {
      allowChangeLanguage: true,
      children: {
        rows: true,
        value: code,
      },
      copyable: true,
      fileName: '',
      language: 'tsx',
      showLanguage: true,
      type: {
        options: ['ghost', 'block', 'pure'],
        value: 'block',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Highlighter fullFeatured {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
