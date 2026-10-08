'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

import { ActionIconImpl as ActionIcon } from '@/ActionIcon/ActionIcon';
import { Center } from '@/Flex';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

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
          className="lobe-image-viewer-nav-prev"
          icon={ChevronLeft}
          size={'large'}
          title={t('image.prev')}
          xstyle={[styles.viewerNavButton, styles.viewerNavPrev]}
          onClick={prev}
        />
      )}
      {hasNext && (
        <ActionIcon
          className="lobe-image-viewer-nav-next"
          icon={ChevronRight}
          size={'large'}
          title={t('image.next')}
          xstyle={[styles.viewerNavButton, styles.viewerNavNext]}
          onClick={next}
        />
      )}
      <Center horizontal {...styleProps(styles.viewerCounter, 'lobe-image-viewer-counter')}>
        {current + 1} / {total}
      </Center>
    </>
  );
});

GalleryNav.displayName = 'GalleryNav';

export default GalleryNav;
