import { Mermaid, MermaidProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

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
      <Mermaid {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
