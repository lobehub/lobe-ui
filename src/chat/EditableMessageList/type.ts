import type { LLMMessage } from '@/chat/types';

export interface EditableMessageListProps {
  dataSources: LLMMessage[];
  disabled?: boolean;
  onChange?: (chatMessages: LLMMessage[]) => void;
}
