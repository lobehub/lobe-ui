'use client';

import clsx from 'clsx';
import { type CSSProperties, memo, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { progressiveBlurClasses } from './stable';
import { styles } from './style';
import type { ProgressiveBlurProps } from './type';
import { clampOpacity, getBlurLayers, LAYER_WEBKIT_BACKDROP_FILTER, toCssSize } from './utils';

const ProgressiveBlur = memo<ProgressiveBlurProps>(
  ({
    children,
    className,
    classNames,
    color,
    gradientOpacity,
    height,
    layers = 3,
    maxBlur = 12,
    mode = 'auto',
    position = 'bottom',
    ref,
    style,
    styles: customStyles,
    ...rest
  }) => {
    const isWrapper = children !== undefined && children !== null && children !== false;

    const blurLayers = useMemo(
      () => (mode === 'gradient' ? [] : getBlurLayers(layers, maxBlur)),
      [layers, maxBlur, mode],
    );

    // Defaults live in the stylesheet; only explicit props go inline.
    const variables = {
      ...(height !== undefined && { '--lobe-progressive-blur-height': toCssSize(height) }),
      ...(color !== undefined && { '--lobe-progressive-blur-color': color }),
      ...(gradientOpacity !== undefined && {
        '--lobe-progressive-blur-gradient-opacity': String(clampOpacity(gradientOpacity)),
      }),
    } as CSSProperties;

    const band = (
      <>
        {blurLayers.map((layer) => (
          <div
            key={layer.start}
            className={
              styleProps(
                [styles.layer, mode === 'auto' && styles.layerAuto],
                clsx(progressiveBlurClasses('layer'), classNames?.layer),
              ).className
            }
            style={
              {
                '--lobe-progressive-blur-layer-blur': `${layer.blur}px`,
                '--lobe-progressive-blur-layer-end': `${layer.end}%`,
                '--lobe-progressive-blur-layer-start': `${layer.start}%`,
                'WebkitBackdropFilter': LAYER_WEBKIT_BACKDROP_FILTER,
                ...customStyles?.layer,
              } as CSSProperties
            }
          />
        ))}
        <div
          style={customStyles?.gradient}
          className={
            styleProps(
              [
                styles.gradient,
                mode === 'auto' && styles.gradientAuto,
                mode === 'gradient' && styles.gradientOnly,
              ],
              clsx(progressiveBlurClasses('gradient'), classNames?.gradient),
            ).className
          }
        />
      </>
    );

    const dataAttributes = toDataAttributes({ mode, position });
    const rootClassName = clsx(progressiveBlurClasses(), className, classNames?.root);
    const rootStyle = { ...variables, ...customStyles?.root, ...style };

    if (!isWrapper) {
      return (
        <div
          aria-hidden
          ref={ref}
          {...dataAttributes}
          {...rest}
          style={rootStyle}
          className={
            styleProps([styles.block, styles.edge, styles[position]], rootClassName).className
          }
        >
          {band}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        {...dataAttributes}
        {...rest}
        className={styleProps([styles.block, styles.wrapper], rootClassName).className}
        style={rootStyle}
      >
        <div
          style={customStyles?.content}
          className={
            styleProps(
              [styles.content],
              clsx(progressiveBlurClasses('content'), classNames?.content),
            ).className
          }
        >
          {children}
        </div>
        <div
          aria-hidden
          style={customStyles?.edge}
          className={
            styleProps(
              [styles.edge, styles[position]],
              clsx(progressiveBlurClasses('edge'), classNames?.edge),
            ).className
          }
        >
          {band}
        </div>
      </div>
    );
  },
);

ProgressiveBlur.displayName = 'ProgressiveBlur';

export default ProgressiveBlur;
