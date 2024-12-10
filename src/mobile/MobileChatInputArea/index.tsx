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
import ChatInputAreaInner, {
  type ChatInputAreaInnerProps,
} from '@/chat/ChatInputArea/ChatInputAreaInner';
import MobileSafeArea from '@/mobile/MobileSafeArea';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      flex: none;
      padding-block: 12px 12px;
      background: ${token.colorFillQuaternary};
      border-block-start: 1px solid ${rgba(token.colorBorder, 0.25)};
    `,
    expand: css`
      position: absolute;
      height: 100%;
    `,
    expandButton: css`
      position: absolute;
      inset-inline-start: 14px;
    `,
    expandTextArea: css`
      flex: 1;
    `,
    inner: css`
      height: inherit;
      padding-block: 0;
      padding-inline: 8px;
    `,
  };
});

export interface MobileChatInputAreaProps extends ChatInputAreaInnerProps {
  bottomAddons?: ReactNode;
  expand?: boolean;
  safeArea?: boolean;
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
      safeArea,
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

    const InnerContainer: FC<
      PropsWithChildren & {
        bottomAddons?: ReactNode;
        textAreaLeftAddons?: ReactNode;
        textAreaRightAddons?: ReactNode;
        topAddons?: ReactNode;
      }
    > = useCallback(
      ({ children, ...r }) =>
        expand ? (
          <Flexbox className={styles.inner} gap={8}>
            <Flexbox gap={8} horizontal justify={'flex-end'}>
              {r.textAreaLeftAddons}
              {r.textAreaRightAddons}
            </Flexbox>
            {children}
            {r.topAddons}
            {r.bottomAddons}
          </Flexbox>
        ) : (
          <Flexbox align={'flex-end'} className={styles.inner} gap={8} horizontal>
            {r.textAreaLeftAddons}
            {children}
            {r.textAreaRightAddons}
          </Flexbox>
        ),
      [expand, loading],
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
          <InnerContainer
            bottomAddons={bottomAddons}
            textAreaLeftAddons={textAreaLeftAddons}
            textAreaRightAddons={textAreaRightAddons}
            topAddons={topAddons}
          >
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
        {safeArea && !isFocused && <MobileSafeArea position={'bottom'} />}
      </Flexbox>
    );
  },
);

export default MobileChatInputArea;
