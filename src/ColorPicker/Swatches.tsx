'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';

import { useRecentColors } from './recent';
import { styles, swatchStyles } from './style';

type Tab = 'presets' | 'recent';

export interface SwatchesProps {
  current: string;
  labels: { presets: string; recent: string; swatches: string };
  onPick: (color: string) => void;
  presets?: string[];
  recent: boolean;
}

const Swatches = ({ current, labels, onPick, presets = [], recent }: SwatchesProps) => {
  const recentColors = useRecentColors();
  const [tab, setTab] = useState<Tab>('presets');

  const shownRecent = recent ? recentColors : [];
  const hasPresets = presets.length > 0;
  const hasRecent = shownRecent.length > 0;
  if (!hasPresets && !hasRecent) return null;

  const tabbed = hasPresets && hasRecent;
  const active: Tab = tabbed ? tab : hasPresets ? 'presets' : 'recent';
  const colors = active === 'recent' ? shownRecent : presets;
  const currentKey = current.toLowerCase();

  return (
    <div {...stylex.props(styles.swatchSection)}>
      {tabbed ? (
        <div aria-label={labels.swatches} role="tablist" {...stylex.props(styles.swatchHeader)}>
          {(['presets', 'recent'] as const).map((item) => (
            <button
              aria-selected={active === item}
              key={item}
              role="tab"
              type="button"
              {...stylex.props(focusRing.info, styles.swatchTab)}
              onClick={() => setTab(item)}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      ) : (
        <div {...stylex.props(styles.swatchHeader)}>
          <span {...stylex.props(styles.swatchLabel)}>{labels[active]}</span>
        </div>
      )}
      <div aria-label={labels[active]} role="group" {...stylex.props(styles.swatchGrid)}>
        {colors.map((color) => {
          const key = color.toLowerCase();
          const selected = key === currentKey || key === currentKey.slice(0, 7);
          return (
            <button
              aria-label={color}
              aria-pressed={selected}
              key={color}
              type="button"
              {...stylex.props(focusRing.info, styles.swatchItem)}
              style={{ color }}
              onClick={() => onPick(color)}
            >
              <span {...stylex.props(swatchStyles.fill)} style={{ background: color }} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Swatches;
