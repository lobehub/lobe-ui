'use client';

import { PropsWithChildren, memo, useEffect, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { useStyles } from './style';
import { useGaussianBackground } from './useGaussianBackground';
import { ColorLayer } from './vendor/gaussianBackground';

export interface GaussianBackgroundProps extends PropsWithChildren, DivProps {
  classNames?: {
    canvas?: string;
    content?: string;
  };
  layers: ColorLayer[];
  options?: {
    blurRadius?: number;
    fpsCap?: number;
    scale?: number;
  };
}

const DEFAULT_OPTIONS = {
  blurRadius: 16,
  fpsCap: 60,
  scale: 16,
};

const GaussianBackground = memo<GaussianBackgroundProps>(
  ({ layers, options = DEFAULT_OPTIONS, className, children, classNames, style, ...rest }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const { cx, styles } = useStyles();
    const run = useGaussianBackground(ref);

    useEffect(() => {
      if (!run) return;
      run(layers, options);
    }, [run, options, layers]);

    return (
      <div className={cx(styles.container, className)} style={style} {...rest}>
        <canvas className={cx(styles.canvas, classNames?.canvas)} ref={ref} />
        <Flexbox className={cx(styles.content, classNames?.content)}>{children}</Flexbox>
      </div>
    );
  },
);

export default GaussianBackground;
