import {
  Highlighter,
  HighlighterProps,
  StoryBook,
  useControls,
  useCreateStore,
} from '@unitalkai/ui';

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
