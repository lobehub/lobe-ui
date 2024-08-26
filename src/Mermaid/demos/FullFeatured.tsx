import { Mermaid, MermaidProps, StoryBook, useControls, useCreateStore } from '@unitalkai/ui';

import { code } from './data';

export default () => {
  const store = useCreateStore();
  const options: MermaidProps | any = useControls(
    {
      children: {
        rows: true,
        value: code,
      },
      copyable: true,
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
      <Mermaid fullFeatured {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
