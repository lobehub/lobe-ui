'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';

import { useVideoContext } from '../context';
import { videoClasses } from '../stable';
import { styles } from '../style';
import { formatTime } from '../time';
import type { VideoSectionListProps } from '../type';
import { useVideo } from '../useVideo';

const SectionList = ({ className, style }: VideoSectionListProps) => {
  const { config, store } = useVideoContext();
  const active = useVideo((state) => state.activeSection);
  if (config.sections.length === 0) return null;

  return (
    <div {...styleProps(styles.sectionList, clsx(videoClasses('section-list'), className), style)}>
      {config.sections.map((section) => (
        <button
          aria-current={section === active ? 'true' : undefined}
          data-video-section=""
          key={section.start}
          type="button"
          {...styleProps(
            [styles.sectionChip, section === active && styles.sectionChipActive],
            videoClasses('section'),
          )}
          onClick={() => store.seek(section.start)}
        >
          <span {...styleProps(styles.sectionChipTime)}>{formatTime(section.start)}</span>
          {section.title}
        </button>
      ))}
    </div>
  );
};

SectionList.displayName = 'VideoSectionList';

export default SectionList;
