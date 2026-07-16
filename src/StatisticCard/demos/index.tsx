import type { StatisticCardProps } from '@lobehub/ui';
import { Flexbox, Statistic, StatisticCard, TitleWithPercentage } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      loading: false,
      precision: 2,
      prefix: '$',
      value: 1128.93,
      variant: {
        options: ['borderless', 'outlined', 'filled'],
        value: 'outlined',
      },
    },
    { store },
  ) as StatisticCardProps;

  return (
    <StoryBook levaStore={store}>
      <Flexbox horizontal gap={16} style={{ width: '100%' }}>
        <StatisticCard
          {...control}
          description={<Statistic title={'yesterday'} value={'$986.12'} />}
          title={<TitleWithPercentage count={1128} prvCount={986} title={'Today Spend'} />}
        />
        <StatisticCard
          {...control}
          description={<Statistic title={'prev month'} value={'2,341'} />}
          title={'Total Messages'}
        />
      </Flexbox>
    </StoryBook>
  );
};
