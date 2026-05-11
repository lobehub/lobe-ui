import { HtmlPreview, type HtmlPreviewProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { html } from './data';

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: html,
      },
      copyable: true,
      defaultHeight: 360,
      downloadable: true,
      shadow: false,
      theme: {
        options: ['light', 'dark'],
        value: 'light',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as HtmlPreviewProps;

  return (
    <StoryBook levaStore={store}>
      <HtmlPreview {...options} style={{ ...options.style, width: '100%' }} />
    </StoryBook>
  );
};
