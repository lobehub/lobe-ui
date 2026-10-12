'use client';

import { Check, ChevronRight } from 'lucide-react';
import { use, useState } from 'react';

import DropdownMenu from '@/DropdownMenu';
import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

import { FrameContext, useVideoContext } from '../context';
import { styles } from '../style';
import { formatTime } from '../time';
import { useVideo } from '../useVideo';

const SectionMenu = () => {
  const { config, store } = useVideoContext();
  const frame = use(FrameContext);
  const { t } = useTranslation(videoMessages);
  const active = useVideo((state) => state.activeSection);
  const [shown, setShown] = useState({ direction: 'none', section: active });
  if (shown.section !== active) {
    const from = shown.section ? config.sections.indexOf(shown.section) : -1;
    const to = active ? config.sections.indexOf(active) : -1;
    setShown({ direction: to >= from ? 'forward' : 'backward', section: active });
  }
  if (config.sections.length === 0) return null;

  return (
    <DropdownMenu
      items={config.sections.map((section) => ({
        extra: section === active ? <Check size={14} /> : formatTime(section.start),
        key: `${section.start}`,
        label: section.title,
        onClick: () => store.seek(section.start),
      }))}
      onOpenChange={(open) => frame?.hold(open)}
    >
      <button title={t('video.sections')} type="button" {...styleProps(styles.chip)}>
        <span
          data-direction={shown.direction}
          data-video-section-label=""
          key={active?.start ?? 'none'}
          {...styleProps([
            styles.chipText,
            shown.direction === 'forward' && styles.chipLabelForward,
            shown.direction === 'backward' && styles.chipLabelBackward,
          ])}
        >
          {active?.title ?? t('video.sections')}
        </span>
        <ChevronRight size={14} />
      </button>
    </DropdownMenu>
  );
};

SectionMenu.displayName = 'VideoSectionMenu';

export default SectionMenu;
