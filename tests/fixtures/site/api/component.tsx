import { type FC, forwardRef, memo } from 'react';

import type { ButtonProps as ExternalButtonProps, InheritedProps } from './inherited';

export interface ButtonProps extends ExternalButtonProps, InheritedProps {
  /** @deprecated */
  bareLegacy?: string;
  /**
   * Uses the legacy presentation.
   * @deprecated Use `tone` instead.
   */
  legacy?: string;
  /**
   * Shows a loading indicator.
   * @default false
   * @since 1.2.0
   */
  loading?: boolean;
  /** Preserves every member when the rendered type is long. */
  mode?:
    | 'alpha'
    | 'beta'
    | 'delta'
    | 'epsilon'
    | 'eta'
    | 'gamma'
    | 'iota'
    | 'kappa'
    | 'lambda'
    | 'mu'
    | 'nu'
    | 'omicron'
    | 'pi'
    | 'theta'
    | 'xi'
    | 'zeta';
  /** Visible button text. */
  requiredLabel: string;
  /** Visual tone selected by the component. */
  tone?: 'brand' | 'neutral';
}

/** Callable public fixture component. */
export const Button: FC<ButtonProps> = ({ requiredLabel, tone = 'neutral' }) => (
  <button data-tone={tone}>{requiredLabel}</button>
);

export const FunctionButton = ({ loading }: ButtonProps) => <button>{String(loading)}</button>;

export const MemoButton = memo(FunctionButton);

export const ForwardButton = ({
  ref: reference,
  ...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => (
  <button ref={reference}>{props.requiredLabel}</button>
);

export const CompoundButton = Object.assign(FunctionButton, {
  Group: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
});

export const IntersectionButton: FC<ButtonProps & { extra?: number }> = ({ extra }) => (
  <button>{extra}</button>
);

interface NestedDefaultProps {
  items?: { tone?: string }[];
  tone?: string;
}

export const NestedDefaultButton = ({ items, tone = 'neutral' }: NestedDefaultProps) => (
  <div data-tone={tone}>
    {items?.map(({ tone = 'wrong' }) => (
      <span key={tone}>{tone}</span>
    ))}
  </div>
);

interface RenamedConflictingDefaultProps {
  /**
   * Whether the fixture is active.
   * @default false
   */
  active?: boolean;
  nested?: { active?: boolean };
}

export const RenamedConflictingDefaultButton = ({
  active: enabled = true,
  nested: { active: nestedActive = false } = {},
}: RenamedConflictingDefaultProps) => <button>{String(enabled || nestedActive)}</button>;

interface NestedBindingDefaultProps {
  settings?: { tone?: string };
}

export const NestedBindingDefaultButton = ({
  settings: { tone = 'nested-only' } = {},
}: NestedBindingDefaultProps) => <button>{tone}</button>;

interface NestedForwardDefaultProps {
  /** Visual tone selected by the wrapped component. */
  tone?: string;
}

export const NestedForwardDefaultButton = memo(
  // eslint-disable-next-line @eslint-react/no-forward-ref -- This fixture verifies nested React wrapper extraction.
  forwardRef<HTMLButtonElement, NestedForwardDefaultProps>(({ tone = 'neutral' }, ref) => (
    <button data-tone={tone} ref={ref} />
  )),
);

interface MemoDefaultProps {
  /** Whether the memoized fixture is active. */
  active?: boolean;
}

const ComponentWithDefaults = ({ active = true }: MemoDefaultProps) => (
  <button>{String(active)}</button>
);

export const MemoDefaultButton = memo(ComponentWithDefaults);

interface MemoConflictingDefaultProps {
  /**
   * Whether the memoized fixture is active.
   * @default false
   */
  active?: boolean;
}

const ComponentWithConflictingDefaults = ({ active = true }: MemoConflictingDefaultProps) => (
  <button>{String(active)}</button>
);

export const MemoConflictingDefaultButton = memo(ComponentWithConflictingDefaults);

interface EquivalentDefaultProps {
  /** @default 'neutral' */
  tone?: string;
}

export const EquivalentDefaultButton = ({ tone = 'neutral' }: EquivalentDefaultProps) => (
  <div data-tone={tone} />
);

interface ConflictingDefaultProps {
  /**
   * Whether the fixture is active.
   * @default false
   */
  active?: boolean;
}

export const ConflictingDefaultButton = ({ active = true }: ConflictingDefaultProps) => (
  <button>{String(active)}</button>
);

interface PrimaryOverloadProps {
  primary: string;
}

interface SecondaryOverloadProps {
  secondary: number;
}

export function OverloadedButton(props: PrimaryOverloadProps): React.ReactNode;
export function OverloadedButton(props: SecondaryOverloadProps): React.ReactNode;
export function OverloadedButton(props: PrimaryOverloadProps | SecondaryOverloadProps) {
  return <button>{'primary' in props ? props.primary : props.secondary}</button>;
}

interface ExactOptionalProps {
  value?: string;
}

interface ExactRequiredProps {
  value: string;
}

export function ExactOptionalOverloadedButton(props: ExactOptionalProps): React.ReactNode;
export function ExactOptionalOverloadedButton(props: ExactRequiredProps): React.ReactNode;
export function ExactOptionalOverloadedButton(props: ExactOptionalProps | ExactRequiredProps) {
  return <button>{props.value}</button>;
}

interface StringIndexProps {
  [key: string]: string;
}

interface NumberIndexProps {
  [key: string]: number;
}

export function IndexOverloadedButton(props: StringIndexProps): React.ReactNode;
export function IndexOverloadedButton(props: NumberIndexProps): React.ReactNode;
export function IndexOverloadedButton(props: StringIndexProps | NumberIndexProps) {
  return <button>{Object.keys(props).length}</button>;
}

export default Button;
