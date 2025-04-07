import { FileTypeIcon, FileTypeIconProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: FileTypeIconProps | any = useControls(
    {
      color: '#F54838',
      filetype: 'pdf',
      size: {
        step: 1,
        value: 48,
      },
      type: {
        options: ['file', 'directory'],
        value: 'file',
      },
      variant: {
        options: ['color', 'mono'],
        value: 'color',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <FileTypeIcon {...control} />
    </StoryBook>
  );
};
