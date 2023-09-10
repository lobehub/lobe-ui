import { ActionIcon, DivProps } from '@lobehub/ui';
import { X } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import { useStyles } from './style';

export interface EmptyCardProps extends DivProps {
  alt?: string;
  cover?: string;
  defaultVisible?: boolean;
  desc: string;
  height?: number;
  onVisibleChange?: (visible: boolean) => void;
  title: string;
  visible?: boolean;
  width?: number;
}

const EmptyCard = memo<EmptyCardProps>(
  ({
    cover,
    visible,
    defaultVisible,
    onVisibleChange,
    alt,
    title,
    desc,
    width,
    height,
    ...props
  }) => {
    const [value, setValue] = useMergeState(true, {
      defaultValue: defaultVisible,
      onChange: onVisibleChange,
      value: visible,
    });

    const { styles } = useStyles();
    if (!value) return null;
    return (
      <Flexbox className={styles.container} {...props}>
        <ActionIcon
          className={styles.close}
          icon={X}
          onClick={() => setValue(false)}
          size={{ blockSize: 24, fontSize: 16 }}
        />
        {cover && (
          <img alt={alt} className={styles.image} height={height} src={cover} width={width} />
        )}
        <div className={styles.content}>
          {title && <h3>{title}</h3>}
          {desc && <p className={styles.desc}>{desc}</p>}
        </div>
      </Flexbox>
    );
  },
);

export default EmptyCard;
