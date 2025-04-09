'use client';

import { useScroll } from 'ahooks';
import { ListEnd } from 'lucide-react';
import { type MouseEventHandler, memo, useEffect, useRef, useState } from 'react';

import Button from '@/Button';

import { useStyles } from './style';
import type { BackBottomProps } from './type';

const BackBottom = memo<BackBottomProps>(
  ({ visibilityHeight = 240, target, onClick, style, className, text }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const { styles, cx } = useStyles(visible);
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
        className={cx(styles, className)}
        glass
        icon={ListEnd}
        onClick={scrollToBottom}
        ref={ref}
        shape={'round'}
        size={'small'}
        style={style}
        variant={'filled'}
      >
        {text || 'Back to bottom'}
      </Button>
    );
  },
);

BackBottom.displayName = 'BackBottom';

export default BackBottom;
