import type { CSSProperties, ReactNode, Ref } from 'react';

export interface FollowUpItem {
  key?: string | number;
  /** Pill text. */
  label: ReactNode;
  /** The message sent when the pill is clicked. Defaults to `label` when it is a string. */
  message?: string;
}

export interface FollowUpClassNames {
  item?: string;
  items?: string;
  root?: string;
  title?: string;
}

export interface FollowUpStyles {
  item?: CSSProperties;
  items?: CSSProperties;
  root?: CSSProperties;
  title?: CSSProperties;
}

export type FollowUpVariant = 'default' | 'a2ui';

export interface FollowUpProps {
  className?: string;
  classNames?: FollowUpClassNames;
  /** Suggested next prompts, two to four short ones. A string is both the label and the message. */
  items: (string | FollowUpItem)[];
  /** Called with the pill's message (and the item) when a pill is clicked. */
  onFollowUp?: (message: string, item: FollowUpItem, index: number) => void;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: FollowUpStyles;
  /** A caption above the pills, e.g. "Try next". */
  title?: ReactNode;
  /**
   * `default`: lobe-ui pills (theme border, body type, fill on hover).
   * `a2ui`: the A2UI playground follow-ups (CopilotKit standard `FollowUp`): bordered pills in the
   * surface colour with type that follows the surrounding font size.
   * @default 'default'
   */
  variant?: FollowUpVariant;
}
