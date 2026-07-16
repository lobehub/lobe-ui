import { extractStaticStyle, StyleProvider } from 'antd-style';
import type { PropsWithChildren } from 'react';

export function StyleRegistry({ children }: PropsWithChildren) {
  return <StyleProvider cache={extractStaticStyle.cache}>{children}</StyleProvider>;
}
