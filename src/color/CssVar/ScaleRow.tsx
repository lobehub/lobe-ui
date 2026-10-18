import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { toast } from '@/Toast';
import { toDataAttributes } from '@/utils/bem';
import { copyToClipboard } from '@/utils/copyToClipboard';

import { cssVarClasses } from './stable';
import { styles } from './style';

export interface IScaleRow {
  name: string;
  scale: string[];
  title: 'light' | 'dark';
}

const ScaleRow = memo<IScaleRow>(({ name, title, scale }) => {
  const isAlpha = false;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cssVarClasses('row')}
      gap={2}
      {...toDataAttributes({ scale: title })}
    >
      <div {...styleProps(styles.scaleRowTitle, cssVarClasses('row-title'))} key={title}>
        <div {...stylex.props(styles.text)}>{title}</div>
      </div>
      {scale.map((color, index) => {
        if (index === 0 || index === 12) return false;

        return (
          <div
            key={index}
            {...styleProps(styles.scaleBox, cssVarClasses('cell'))}
            title={color}
            onClick={async () => {
              const content = `token.${name}${index}${isAlpha ? 'A' : ''} /* ${color} */`;

              await copyToClipboard(content);
              toast.success(content);
            }}
          >
            <Flexbox
              horizontal
              align={'center'}
              justify={'center'}
              {...styleProps(styles.scaleItem, cssVarClasses('swatch'))}
              style={{ backgroundColor: color }}
            />
          </div>
        );
      })}
    </Flexbox>
  );
});

export default ScaleRow;
