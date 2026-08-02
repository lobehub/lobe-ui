'use client';

import { cx } from 'antd-style';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Center } from '@/Flex';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';

import { styles } from '../style';

export interface GalleryNavProps {
  current: number;
  hasNext: boolean;
  hasPrev: boolean;
  next: () => void;
  prev: () => void;
  total: number;
}

const GalleryNav = memo<GalleryNavProps>(({ current, hasNext, hasPrev, next, prev, total }) => {
  const { t } = useTranslation(imageMessages);

  return (
    <>
      {hasPrev && (
        <ActionIcon
          className={cx(styles.viewerNavButton, styles.viewerNavPrev)}
          icon={ChevronLeft}
          title={t('image.prev')}
          onClick={prev}
        />
      )}
      {hasNext && (
        <ActionIcon
          className={cx(styles.viewerNavButton, styles.viewerNavNext)}
          icon={ChevronRight}
          title={t('image.next')}
          onClick={next}
        />
      )}
      <Center horizontal className={styles.viewerCounter}>
        {current + 1} / {total}
      </Center>
    </>
  );
});

GalleryNav.displayName = 'GalleryNav';

export default GalleryNav;
