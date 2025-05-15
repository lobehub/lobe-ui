'use client';

import { memo } from 'react';

const Span = memo<{ children?: string }>(({ children }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: children || '',
      }}
    />
  );
});

Span.displayName = 'HighlighterSpan';

export default Span;
