import { Grid, GroupAvatar, Text } from '@lobehub/ui';

import { Center } from '@/Flex';
import { SMOOTH_CORNER_MASKS } from '@/utils/smoothCorners';

const avatars = [
  'https://avatar.vercel.sh/jane',
  'https://avatar.vercel.sh/john',
  'https://avatar.vercel.sh/alice',
  'https://avatar.vercel.sh/bob',
];

const cornerTypes = Object.keys(SMOOTH_CORNER_MASKS) as Array<keyof typeof SMOOTH_CORNER_MASKS>;

const descriptions = {
  circle: 'Perfect circle shape (50% border radius)',
  ios: 'iOS-style corners (n=5) - used in Apple icons since iOS 7',
  sharp: 'Sharp corners (n=6) - subtle rounding, closer to rectangle',
  smooth: 'Extra smooth corners (n=3) - more rounded appearance',
  square: 'Rounded square (15% border radius)',
  squircle: 'Classic squircle shape (n=4) - balanced between square and circle',
};

export default () => {
  return (
    <Grid gap={16} rows={3} width={'100%'}>
      {cornerTypes.map((type) => (
        <Center key={type}>
          <GroupAvatar
            avatars={avatars}
            cornerShape={type}
            size={100}
            style={{ margin: '0 auto 16px' }}
          />
          <Text align={'center'} fontSize={14} weight={'bold'}>
            {type}
          </Text>
          <Text align={'center'} fontSize={12} type={'secondary'}>
            {descriptions[type]}
          </Text>
        </Center>
      ))}
    </Grid>
  );
};
