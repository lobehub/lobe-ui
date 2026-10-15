'use client';

import { type ComponentType, type CSSProperties, useEffect, useRef, useState } from 'react';

import { PREFIX_CLS } from './style';

interface PurePanelProps {
  open?: boolean;
  style?: CSSProperties;
}

/**
 * antd `genPurePanel`: the picker with its popup always open and rendered in flow below
 * the input — for docs and visual tests, not for apps. The holder reserves the popup's
 * height, the popup does not flip or shift, and it has no motion or stacking z-index.
 */
const genPurePanel = <P extends object>(Component: ComponentType<P>) => {
  const PurePanel = (props: P & PurePanelProps) => {
    const { open: openProp, style } = props;
    const holderRef = useRef<HTMLDivElement>(null);
    const [popupSize, setPopupSize] = useState({ height: 0, width: 0 });
    const [mounted, setMounted] = useState(false);

    // Opened after mount, as in antd: the popup needs the holder to render into.
    useEffect(() => {
      setMounted(true);
      if (typeof ResizeObserver === 'undefined') return;
      const resizeObserver = new ResizeObserver(([entry]) => {
        const element = entry.target as HTMLElement;
        setPopupSize({ height: element.offsetHeight + 8, width: element.offsetWidth });
      });
      const interval = setInterval(() => {
        const popup = holderRef.current?.querySelector(`.${PREFIX_CLS}-dropdown`);
        if (!popup) return;
        clearInterval(interval);
        resizeObserver.observe(popup);
      }, 10);
      return () => {
        clearInterval(interval);
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        ref={holderRef}
        style={{ minWidth: popupSize.width, paddingBottom: popupSize.height, position: 'relative' }}
      >
        <Component
          {...props}
          inlinePopup
          getPopupContainer={() => holderRef.current!}
          open={openProp ?? mounted}
          style={{ ...style, margin: 0 }}
        />
      </div>
    );
  };
  return PurePanel;
};

export default genPurePanel;
