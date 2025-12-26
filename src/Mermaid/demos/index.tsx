import { Mermaid, MermaidProps, mermaidThemes } from '@lobehub/ui';
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
      shadow: false,
      showLanguage: true,
      theme: {
        options: mermaidThemes.map((item) => item.id),
        value: mermaidThemes[0].id,
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as MermaidProps;

  return (
    <StoryBook levaStore={store}>
      <Mermaid {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
