import { type InputRef } from 'antd';
import { useResponsive } from 'antd-style';
import { forwardRef } from 'react';

import Desktop, { ChatInputAreaDesktop } from './Desktop';
import Mobile, { ChatInputAreaMobile } from './Mobile';

export type ChatInputAreaProps = ChatInputAreaDesktop & ChatInputAreaMobile;

const ChatInputArea = forwardRef<InputRef, ChatInputAreaProps>((props, ref) => {
  const { mobile } = useResponsive();

  const Render = mobile ? Mobile : Desktop;

  return <Render ref={ref} {...props} />;
});

export default ChatInputArea;
