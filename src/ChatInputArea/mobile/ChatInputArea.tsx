import { useSize } from 'ahooks';
import { createStyles } from 'antd-style';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { rgba } from 'polished';
import {
  CSSProperties,
  FC,
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';

import ChatInputAreaInner, { type ChatInputAreaInnerProps } from '../ChatInputAreaInner';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      padding: 12px 0;
      background: ${token.colorFillQuaternary};
      border-top: 1px solid ${rgba(token.colorBorder, 0.25)};
    `,
    expand: css`
      height: 100%;
    `,
    expandButton: css`
      position: absolute;
      left: 14px;
    `,
    expandTextArea: css`
      flex: 1;
    `,
    inner: css`
      height: inherit;
      padding: 0 8px;
    `,
  };
});

export interface MobileChatInputAreaProps extends ChatInputAreaInnerProps {
  bottomAddons?: ReactNode;
  expand?: boolean;
  setExpand?: (expand: boolean) => void;
  style?: CSSProperties;
  textAreaLeftAddons?: ReactNode;
  textAreaRightAddons?: ReactNode;
  topAddons?: ReactNode;
}

const MobileChatInputArea = forwardRef<TextAreaRef, MobileChatInputAreaProps>(
  (
    {
      className,
      style,
      topAddons,
      textAreaLeftAddons,
      textAreaRightAddons,
      bottomAddons,
      expand = false,
      setExpand,
      onSend,
      onInput,
      loading,
      value,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { cx, styles } = useStyles();
    const size = useSize(containerRef);
    const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
      if (!size?.height) return;
      setShowFullscreen(size.height > 72);
    }, [size]);

    const InnerContainer: FC<PropsWithChildren> = useCallback(
      ({ children }) =>
        expand ? (
          <Flexbox className={styles.inner} gap={8}>
            <Flexbox gap={8} horizontal justify={'flex-end'}>
              {textAreaLeftAddons}
              {textAreaRightAddons}
            </Flexbox>
            {children}
            {topAddons}
            {bottomAddons}
          </Flexbox>
        ) : (
          <Flexbox align={'flex-end'} className={styles.inner} gap={8} horizontal>
            {textAreaLeftAddons}
            {children}
            {textAreaRightAddons}
          </Flexbox>
        ),
      [expand],
    );

    const showAddons = !expand && !isFocused;

    return (
      <Flexbox
        className={cx(styles.container, expand && styles.expand, className)}
        gap={12}
        style={style}
      >
        {topAddons && <Flexbox style={showAddons ? {} : { display: 'none' }}>{topAddons}</Flexbox>}
        <Flexbox
          className={cx(expand && styles.expand)}
          ref={containerRef}
          style={{ position: 'relative' }}
        >
          {showFullscreen && (
            <ActionIcon
              active
              className={styles.expandButton}
              icon={expand ? ChevronDown : ChevronUp}
              onClick={() => setExpand?.(!expand)}
              size={{ blockSize: 24, borderRadius: '50%', fontSize: 14 }}
              style={expand ? { top: 6 } : {}}
            />
          )}
          <InnerContainer>
            <ChatInputAreaInner
              autoSize={expand ? false : { maxRows: 6, minRows: 0 }}
              className={cx(expand && styles.expandTextArea)}
              loading={loading}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onInput={onInput}
              onSend={onSend}
              ref={ref}
              style={{ height: 36, paddingBlock: 6 }}
              type={expand ? 'pure' : 'block'}
              value={value}
            />
          </InnerContainer>
        </Flexbox>
        {bottomAddons && (
          <Flexbox style={showAddons ? {} : { display: 'none' }}>{bottomAddons}</Flexbox>
        )}
      </Flexbox>
    );
  },
);

export default MobileChatInputArea;
