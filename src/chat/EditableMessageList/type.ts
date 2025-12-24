import type { LLMMessage } from '@/chat/types';

export interface EditableMessageListProps {
  dataSources: LLMMessage[];
  disabled?: boolean;
  onChange?: (chatMessages: LLMMessage[]) => void;
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
