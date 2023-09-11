import { ReactNode } from 'react';

import { ActionProps } from '@/ChatInputArea/Action';

export interface ChatInputBase extends ActionProps {
  /**
   * @description Default value for the input area
   */
  defaultValue?: string;
  /**
   * @description Footer content to be displayed below the input area
   */
  footer?: ReactNode;
  /**
   * @description Whether the input area is in loading state
   * @default false
   */
  loading?: boolean;
  /**
   * @description Callback function when the input value changes
   * @param value - The current value of the input area
   */
  onInputChange?: (value: string) => void;
  /**
   * @description Callback function when the send button is clicked
   * @param value - The current value of the input area
   */
  onSend?: (value: string) => void;
  onStop?: () => void;
  text?: {
    send?: string;
    stop?: string;
  };
  value?: string;
}
