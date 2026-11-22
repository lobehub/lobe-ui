'use client';

import clsx from 'clsx';
import { memo, type ReactNode } from 'react';

import Divider from '@/brand/components/Divider';
import { styles } from '@/brand/LobeHub/style';
import LobotMono from '@/brand/LobotMono';
import LobotText from '@/brand/LobotText';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import type { SvgProps } from '@/types';
import { toDataAttributes } from '@/utils/bem';

import { brandLobotClasses } from './stable';
import type { LobotProps } from './type';

// Ratios of the official lockup, from `Lobot.Combine` in @lobehub/icons.
const TEXT_MULTIPLE = 0.695;
const SPACE_MULTIPLE = 0.154;
// The wordmark sits slightly below the center of the mark.
const TEXT_SHIFT_MULTIPLE = 0.0345;
const EXTRA_MULTIPLE = 0.8;

const Lobot = memo<LobotProps>(({ type = 'mono', size = 32, style, extra, className, ...rest }) => {
  const rootClassName = clsx(brandLobotClasses(), className);
  const dataAttributes = toDataAttributes({ type });
  const textSize = Math.round(size * TEXT_MULTIPLE);
  const isRoot = !extra && type !== 'combine';
  const rootProps = { className: rootClassName, style, ...dataAttributes, ...rest };
  // Without a wrapper the single SVG is the root, so it carries the root props.
  const svgProps = (part: 'logo' | 'text') =>
    isRoot ? (rootProps as unknown as SvgProps) : { className: brandLobotClasses(part) };

  const mark = <LobotMono size={size} {...svgProps('logo')} />;
  const text = <LobotText size={textSize} {...svgProps('text')} />;

  let logoComponent: ReactNode;

  switch (type) {
    case 'mono': {
      logoComponent = mark;
      break;
    }
    case 'text': {
      logoComponent = text;
      break;
    }
    case 'combine': {
      logoComponent = (
        <>
          {mark}
          <LobotText
            className={brandLobotClasses('text')}
            size={textSize}
            style={{
              marginLeft: Math.round(size * SPACE_MULTIPLE),
              transform: `translateY(${size * TEXT_SHIFT_MULTIPLE}px)`,
            }}
          />
        </>
      );
      break;
    }
  }

  if (isRoot) return logoComponent;

  const extraSize = Math.round(size * EXTRA_MULTIPLE);

  return (
    <Flexbox horizontal align={'center'} flex={'none'} {...rootProps}>
      {logoComponent}
      {extra && (
        <>
          <Divider size={extraSize} {...styleProps(styles.divider, brandLobotClasses('divider'))} />
          <div
            {...styleProps(styles.extraTitle, brandLobotClasses('extra'), { fontSize: extraSize })}
          >
            {extra}
          </div>
        </>
      )}
    </Flexbox>
  );
});

Lobot.displayName = 'LobotBrand';

export default Lobot;
