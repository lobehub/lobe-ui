import { Highlighter, HighlighterProps, highlighterThemes } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { code } from './data';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      allowChangeLanguage: true,
      children: {
        rows: true,
        value: code,
      },
      copyable: true,
      fileName: '',
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
      <Highlighter fullFeatured {...options} />
    </StoryBook>
  );
};
