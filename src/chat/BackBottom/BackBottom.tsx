'use client';

import { useScroll } from 'ahooks';
import { cx } from 'antd-style';
import { ListEnd } from 'lucide-react';
import { memo, type MouseEventHandler, useEffect, useRef, useState } from 'react';

import Button from '@/Button';

import { styles } from './style';
import { type BackBottomProps } from './type';

const BackBottom = memo<BackBottomProps>(
  ({ visibilityHeight = 240, target, onClick, style, className, text }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);
    const current = (target as any)?.current;
    const scrollHeight = current?.scrollHeight || 0;
    const clientHeight = current?.clientHeight || 0;
    const scroll = useScroll(target);

    useEffect(() => {
      if (scroll?.top) {
        setVisible(scroll?.top + clientHeight + visibilityHeight < scrollHeight);
      }
    }, [scrollHeight, scroll, visibilityHeight]);

    const scrollToBottom: MouseEventHandler<HTMLDivElement> = (e) => {
      (target as any)?.current?.scrollTo({ behavior: 'smooth', left: 0, top: scrollHeight });
      onClick?.(e);
    };

    return (
      <Button
        glass
        className={cx(visible ? styles.visible : styles.hidden, className)}
        icon={ListEnd}
        ref={ref}
        shape={'round'}
        size={'small'}
        style={style}
        variant={'filled'}
        onClick={scrollToBottom}
      >
        {text || 'Back to bottom'}
      </Button>
    );
  },
);

BackBottom.displayName = 'BackBottom';

export default BackBottom;
