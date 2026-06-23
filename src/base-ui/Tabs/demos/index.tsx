import { Flexbox } from '@lobehub/ui';
import { Tabs, type TabsProps } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { FlameIcon, HomeIcon, PaletteIcon, PuzzleIcon } from 'lucide-react';

const items: TabsProps['items'] = [
  {
    children: <Flexbox padding={16}>Home panel</Flexbox>,
    icon: <HomeIcon size={14} />,
    key: 'home',
    label: 'Home',
  },
  {
    children: <Flexbox padding={16}>Components panel</Flexbox>,
    icon: <PuzzleIcon size={14} />,
    key: 'components',
    label: 'Components',
  },
  {
    children: <Flexbox padding={16}>Color panel</Flexbox>,
    icon: <PaletteIcon size={14} />,
    key: 'color',
    label: 'Color',
  },
  {
    children: <Flexbox padding={16}>Changelog panel</Flexbox>,
    icon: <FlameIcon size={14} />,
    key: 'changelog',
    label: 'Changelog',
  },
];

export default () => {
  const store = useCreateStore();

  const controls = useControls(
    {
      orientation: {
        options: ['horizontal', 'vertical'],
        value: 'horizontal',
      },
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      variant: {
        options: ['rounded', 'square', 'point'],
        value: 'rounded',
      },
    },
    { store },
  ) as TabsProps;

  return (
    <StoryBook levaStore={store}>
      <Tabs defaultActiveKey="components" items={items} {...controls} />
    </StoryBook>
  );
};
