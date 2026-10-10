'use client';

import { useSize } from 'ahooks';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  type FC,
  memo,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import ActionIcon from '@/ActionIcon';
import ChatInputAreaInner from '@/chat/ChatInputArea/components/ChatInputAreaInner';
import { Flexbox } from '@/Flex';
import SafeArea from '@/mobile/SafeArea';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import { type ChatInputAreaProps } from './type';

const ChatInputArea = memo<ChatInputAreaProps>(
  ({
    ref,
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
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
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
          <Flexbox gap={8} height={'inherit'} paddingInline={8}>
            <Flexbox horizontal gap={8} justify={'flex-end'}>
              {r.textAreaLeftAddons}
              {r.textAreaRightAddons}
            </Flexbox>
            {children}
            {r.topAddons}
            {r.bottomAddons}
          </Flexbox>
        ) : (
          <Flexbox horizontal align={'flex-end'} gap={8} height={'inherit'} paddingInline={8}>
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
        flex={'none'}
        gap={12}
        height={expand ? '100%' : undefined}
        paddingBlock={12}
        width={expand ? '100%' : undefined}
        {...styleProps([styles.container, expand && styles.expand], className, style)}
      >
        {topAddons && <Flexbox style={showAddons ? {} : { display: 'none' }}>{topAddons}</Flexbox>}
        <Flexbox
          height={expand ? '100%' : undefined}
          ref={containerRef}
          style={{ position: 'relative' }}
          width={expand ? '100%' : undefined}
        >
          {showFullscreen && (
            <ActionIcon
              active
              icon={expand ? ChevronDown : ChevronUp}
              id={'sssssss'}
              size={{ blockSize: 24, borderRadius: '50%', size: 14 }}
              style={{ insetInlineEnd: 14, position: 'absolute', ...(expand ? { top: 6 } : {}) }}
              onClick={() => setExpand?.(!expand)}
            />
          )}
          <InnerContainer
            bottomAddons={bottomAddons}
            textAreaLeftAddons={textAreaLeftAddons}
            textAreaRightAddons={textAreaRightAddons}
            topAddons={topAddons}
          >
            <ChatInputAreaInner
              autoSize={expand ? false : { maxRows: 6, minRows: 1 }}
              loading={loading}
              ref={ref}
              style={{ flex: 1, minHeight: 36, paddingBlock: 6 }}
              value={value}
              variant={expand ? 'borderless' : 'filled'}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onInput={onInput}
              onSend={onSend}
            />
          </InnerContainer>
        </Flexbox>
        {bottomAddons && (
          <Flexbox style={showAddons ? {} : { display: 'none' }}>{bottomAddons}</Flexbox>
        )}
        {safeArea && !isFocused && <SafeArea position={'bottom'} />}
      </Flexbox>
    );
  },
);

ChatInputArea.displayName = 'ChatInputArea';

export default ChatInputArea;
