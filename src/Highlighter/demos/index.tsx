import { Highlighter, HighlighterProps, highlighterThemes } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { code } from './data';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: code,
      },
      copyable: true,
      language: 'tsx',
      shadow: false,
      showLanguage: true,
      theme: {
        options: highlighterThemes.map((item) => item.id),
        value: highlighterThemes[0].id,
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
      wrap: false,
    },
    { store },
  ) as HighlighterProps;

  return (
    <StoryBook levaStore={store}>
      <Highlighter {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
