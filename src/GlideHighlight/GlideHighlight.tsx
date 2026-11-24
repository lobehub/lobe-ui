'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';
import { composeEventHandlers } from '@/utils/composeEventHandlers';
import { useMergeRefs } from '@/utils/mergeRefs';

import { glideHighlightClasses } from './stable';
import { styles } from './style';
import type { GlideHighlightProps } from './type';
import { useGlideHighlight } from './useGlideHighlight';

const GlideHighlight: FC<GlideHighlightProps> = ({
  children,
  className,
  classNames,
  disabled = false,
  onBlurCapture,
  onFocusCapture,
  onMouseLeave,
  onMouseOver,
  ref,
  rowSelector = '[data-glide-row]',
  style,
  styles: customStyles,
  ...rest
}) => {
  const { containerProps, containerRef, gliding, highlightStyle, visible } =
    useGlideHighlight<HTMLDivElement>({ disabled, rowSelector });
  const mergedRef = useMergeRefs([containerRef, ref]);

  return (
    <div
      ref={mergedRef}
      {...styleProps(styles.root, clsx(glideHighlightClasses(), className), style)}
      {...toDataAttributes({ gliding, visible })}
      {...rest}
      onBlurCapture={composeEventHandlers(onBlurCapture, containerProps.onBlurCapture)}
      onFocusCapture={composeEventHandlers(onFocusCapture, containerProps.onFocusCapture)}
      onMouseLeave={composeEventHandlers(onMouseLeave, containerProps.onMouseLeave)}
      onMouseOver={composeEventHandlers(onMouseOver, containerProps.onMouseOver)}
    >
      <span
        aria-hidden
        {...styleProps(
          [styles.highlight, gliding && styles.gliding, visible && styles.visible],
          clsx(glideHighlightClasses('highlight'), classNames?.highlight),
          { ...highlightStyle, ...customStyles?.highlight },
        )}
      />
      {children}
    </div>
  );
};

GlideHighlight.displayName = 'GlideHighlight';

export default GlideHighlight;
