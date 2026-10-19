import type { CSSProperties } from 'react';

import type { LLMMessage } from '@/chat/types';

export interface EditableMessageListProps {
  className?: string;
  dataSources: LLMMessage[];
  disabled?: boolean;
  onChange?: (chatMessages: LLMMessage[]) => void;
  style?: CSSProperties;
  texts?: {
    addProps?: string;
    delete?: string;
    input?: string;
    inputPlaceholder?: string;
    output?: string;
    outputPlaceholder?: string;
    system?: string;
  };
}
