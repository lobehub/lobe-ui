import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { toast } from '@/Toast';
import { toDataAttributes } from '@/utils/bem';
import { copyToClipboard } from '@/utils/copyToClipboard';

import { cssVarClasses } from './stable';
import { styles } from './style';

export interface IScaleRow {
  name: string;
}

const ScaleRow = memo<IScaleRow>(({ name }) => {
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cssVarClasses('row')}
      gap={2}
      {...toDataAttributes({ scale: 'css-var' })}
    >
      <div {...styleProps(styles.scaleRowTitle, cssVarClasses('row-title'))} key={name}>
        <div {...stylex.props(styles.text)}>cssVar</div>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((color) => {
        return (
          <div
            key={color}
            {...styleProps(styles.scaleBox, cssVarClasses('cell'))}
            title={(cssVar as any)[`${name}${color}`] as any}
            onClick={async () => {
              const content = (cssVar as any)[`${name}${color}`] as any;

              await copyToClipboard(content);
              toast.success(content);
            }}
          >
            <Flexbox
              horizontal
              align={'center'}
              justify={'center'}
              {...styleProps(styles.scaleItem, cssVarClasses('swatch'))}
              style={{ backgroundColor: (cssVar as any)[`${name}${color}`] as any }}
            />
          </div>
        );
      })}
    </Flexbox>
  );
});

export default ScaleRow;
