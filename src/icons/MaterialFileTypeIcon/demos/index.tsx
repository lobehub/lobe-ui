import { MaterialFileTypeIcon, MaterialFileTypeIconProps } from '@lobehub/ui/icons';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control: MaterialFileTypeIconProps | any = useControls(
    {
      filename: 'xxx.pdf',
      open: false,
      size: {
        step: 1,
        value: 48,
      },
      type: {
        options: ['file', 'directory'],
        value: 'file',
      },
      variant: {
        options: ['pure', 'file', 'folder'],
        value: 'pure',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <MaterialFileTypeIcon {...control} />
    </StoryBook>
  );
};
