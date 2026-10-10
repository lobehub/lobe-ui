import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { toast } from '@/Toast';
import { copyToClipboard } from '@/utils/copyToClipboard';

import { styles } from './style';

export interface IScaleRow {
  name: string;
  scale: string[];
  title: 'light' | 'dark';
}

const ScaleRow = memo<IScaleRow>(({ name, title, scale }) => {
  const style = {};
  const isAlpha = false;

  return (
    <Flexbox horizontal align={'center'} gap={2}>
      <div {...stylex.props(styles.scaleRowTitle)} key={title}>
        <div {...stylex.props(styles.text)}>{title}</div>
      </div>
      {scale.map((color, index) => {
        if (index === 0 || index === 12) return false;

        return (
          <div
            {...stylex.props(styles.scaleBox)}
            key={index}
            style={style}
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
              {...stylex.props(styles.scaleItem)}
              justify={'center'}
              style={{ backgroundColor: color }}
            />
          </div>
        );
      })}
    </Flexbox>
  );
});

export default ScaleRow;
