# base-ui Remaining Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship antd-free base-ui `DatePicker`, `DateRangePicker`, `ColorPicker`, `QRCode`, `Burger`, the Input-family gaps, and remove the `rc-menu` type dependency from base-ui menus.

**Architecture:** Every component lives in `src/base-ui/<Name>/` with the standard layout (`<Name>.tsx`, `type.ts`, `style.ts`, `index.ts`, `index.mdx`, `demos/`, `__tests__/`). Pickers share one popup surface (`src/base-ui/panelStyles.ts`) and are built on the existing Popover atoms (`PopoverRoot`, `PopoverTriggerElement`, `PopoverPortal`, `PopoverPositioner`, `PopoverPopup`). Pure logic (calendar grids, colour conversion, QR path building) sits in plain `.ts` modules with unit tests; components stay thin.

**Tech Stack:** React 19, `@base-ui/react` 1.8, `antd-style` `createStaticStyles` + `cssVar`, `dayjs` (internal only), `chroma-js`, `uqr` (new), `use-merge-value`, `lucide-react`, vitest + @testing-library/react (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-01-base-ui-remaining-components-design.md`

## Global Constraints

- No new imports from `antd`, `@ant-design/*`, `@rc-component/*` or `rc-*` in any file this plan touches. `antd-style` is allowed.
- Public types never mention `Dayjs` or a colour class: dates are `Date`, colours are hex strings.
- Visual language (style B, solid surface): popups `colorBgElevated`, 16px radius, `${cssVar.boxShadow}, var(--lobe-ring)`; titles 22px / 600 with the secondary part in `colorTextTertiary` weight 400; labels 10px / 600 / `letter-spacing: 0.08em` / uppercase / `colorTextTertiary`; round cells and pills; selection = `colorText` fill with `colorBgContainer` text; today / current = `inset 0 0 0 1px colorText`.
- Triggers reuse the base-ui Input shell: `rootVariants({ shadow, size, variant })` from `src/base-ui/Input/style.ts`; default variant is `filled` in dark mode, `outlined` in light mode (same rule as `Input`).
- Zero comments and zero JSDoc in new code (repo owner rule). Comment only for a real workaround.
- User-facing strings go through `useTranslation(<namespace defaults>)` from `@/i18n/useTranslation`, with `en` and `zhCn` resources.
- Run lint only on files you touched: `pnpm exec eslint <files>`. Run tests with `pnpm vitest run <path>`.
- Commit messages are gitmoji (`✨ feat(base-ui): …`, `♻️ refactor(base-ui): …`, `📝 docs: …`). No co-author lines.

## Review Focus

- A `Date` carrying a time of day (e.g. `new Date()` at 15:42) passed as `value` or `min`: the matching day must render selected / enabled; comparisons are by calendar day, never by timestamp. Pinned in Task 3 (`isDayDisabled` with a time-of-day `min`).
- Picking the range end before the start in `DateRangePicker`: the pair is emitted ordered `[earlier, later]`. Pinned in Task 5.
- A controlled `Input` whose parent ignores `onChange`: pressing the clear button must not leave the DOM showing `''` while React state still holds the old text. Pinned in Task 2 (controlled clear test asserts the value follows state).
- Pressing Enter to confirm a Chinese IME candidate must not submit. Pinned in Task 2 (`isComposing` and `keyCode 229`).
- A grey or black `ColorPicker` value (`#808080`, `#000000`): hue is undefined in HSV; dragging saturation must not snap the hue slider to 0. Pinned in Task 6 (`parseColor` keeps the fallback hue).

---

### Task 1: Menu item types without `rc-menu`

**Files:**

- Create: `src/Menu/itemInterface.ts`
- Modify: `src/Menu/type.ts:1-66`
- Modify: `src/base-ui/DropdownMenu/renderItems.tsx:2`
- Modify: `src/base-ui/ContextMenu/renderItems.tsx:4`

**Interfaces:**

- Produces: `MenuInfo`, `RcMenuItemType`, `RcSubMenuType`, `RcMenuItemGroupType`, `RcMenuDividerType` exported from `src/Menu/itemInterface.ts`; `MenuInfo` still re-exported from `@/Menu`.

- [ ] **Step 1: Create the local interface file**

`src/Menu/itemInterface.ts`:

```ts
import type {
  CSSProperties,
  KeyboardEvent,
  Key,
  MouseEvent,
  ReactInstance,
  ReactNode,
  Ref,
} from 'react';

export interface MenuInfo {
  domEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
  item: ReactInstance;
  key: string;
  keyPath: string[];
}

export interface MenuTitleInfo {
  domEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
  key: string;
}

export type MenuClickEventHandler = (info: MenuInfo) => void;

export type MenuHoverEventHandler = (info: {
  domEvent: MouseEvent<HTMLElement>;
  key: string;
}) => void;

export interface RenderIconInfo {
  disabled?: boolean;
  isOpen?: boolean;
  isSelected?: boolean;
  isSubMenu?: boolean;
}

export type RenderIconType = ReactNode | ((props: RenderIconInfo) => ReactNode);

interface ItemSharedProps {
  className?: string;
  ref?: Ref<HTMLLIElement | null>;
  style?: CSSProperties;
}

export interface RcSubMenuType extends ItemSharedProps {
  children: RcItemType[];
  disabled?: boolean;
  expandIcon?: RenderIconType;
  itemIcon?: RenderIconType;
  key: string;
  label?: ReactNode;
  onClick?: MenuClickEventHandler;
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;
  popupClassName?: string;
  popupOffset?: number[];
  popupStyle?: CSSProperties;
  rootClassName?: string;
  type?: 'submenu';
}

export interface RcMenuItemType extends ItemSharedProps {
  disabled?: boolean;
  extra?: ReactNode;
  itemIcon?: RenderIconType;
  key: Key;
  label?: ReactNode;
  onClick?: MenuClickEventHandler;
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;
  type?: 'item';
}

export interface RcMenuItemGroupType extends ItemSharedProps {
  children?: RcItemType[];
  label?: ReactNode;
  type: 'group';
}

export interface RcMenuDividerType extends Omit<ItemSharedProps, 'ref'> {
  type: 'divider';
}

export type RcItemType =
  RcSubMenuType | RcMenuItemType | RcMenuItemGroupType | RcMenuDividerType | null;
```

- [ ] **Step 2: Point `src/Menu/type.ts` at it**

Replace lines 2-7:

```ts
import type {
  RcMenuDividerType,
  RcMenuItemGroupType,
  RcMenuItemType,
  RcSubMenuType,
} from './itemInterface';
```

The rest of the file already refers to these four names, so only the import changes. Then replace the last line

```ts
export type { MenuInfo } from 'rc-menu/es/interface';
```

with

```ts
export type { MenuInfo } from './itemInterface';
```

- [ ] **Step 3: Switch the two base-ui renderers**

In `src/base-ui/DropdownMenu/renderItems.tsx` replace line 2 with:

```ts
import type { MenuInfo } from '@/Menu';
```

In `src/base-ui/ContextMenu/renderItems.tsx` replace line 4 with the same import.

- [ ] **Step 4: Verify no `rc-menu` import remains in base-ui or Menu types**

Run: `rg -n "rc-menu" src/base-ui src/Menu`
Expected: no output.

- [ ] **Step 5: Type-check the touched area**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | rg "src/(Menu|base-ui/(DropdownMenu|ContextMenu))"`
Expected: no output. If antd's `Menu` rejects the local item types structurally, the error names the mismatched field; copy that field's exact type from `node_modules/rc-menu/es/interface.d.ts` into `itemInterface.ts`.

- [ ] **Step 6: Run the menu tests**

Run: `pnpm vitest run src/base-ui/DropdownMenu src/base-ui/ContextMenu src/Menu`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/Menu/itemInterface.ts src/Menu/type.ts src/base-ui/DropdownMenu/renderItems.tsx src/base-ui/ContextMenu/renderItems.tsx
git commit -m "♻️ refactor(base-ui): drop rc-menu types from menus"
```

---

### Task 2: Input family gaps (i18n `common.clear`, onPressEnter, allowClear, InputNumber precision / slots, TextArea showCount)

**Files:**

- Modify: `src/i18n/resources/en/common.ts`, `src/i18n/resources/zhCn/common.ts`
- Create: `src/base-ui/Input/pressEnter.ts`
- Create: `src/base-ui/Input/clearNativeValue.ts`
- Create: `src/base-ui/Input/ClearButton.tsx`
- Modify: `src/base-ui/Input/type.ts`, `src/base-ui/Input/style.ts`, `src/base-ui/Input/Input.tsx`, `src/base-ui/Input/TextArea.tsx`, `src/base-ui/Input/InputNumber.tsx`, `src/base-ui/Input/index.md`
- Test: `src/base-ui/Input/__tests__/InputGaps.test.tsx`

**Interfaces:**

- Produces: `ClearButton` (default export, props `{ onClear: () => void }`) from `src/base-ui/Input/ClearButton.tsx`; it renders `data-lobe-input-clear` and is visible only while the nearest `rootVariants` shell is hovered or focused. Tasks 4 and 5 reuse it.
- Produces: `isPressEnter(event: KeyboardEvent): boolean` from `src/base-ui/Input/pressEnter.ts`.
- Produces: new props `InputProps.allowClear`, `InputProps.onClear`, `InputProps.onPressEnter`; `TextAreaProps.allowClear`, `onClear`, `onPressEnter`, `showCount`; `InputNumberProps.onPressEnter`, `precision`, `prefix`, `suffix`.

- [ ] **Step 1: Add the `common.clear` key**

`src/i18n/resources/en/common.ts` gains `'common.clear': 'Clear',` (keep keys sorted). `src/i18n/resources/zhCn/common.ts` gains `'common.clear': '清除',`.

- [ ] **Step 2: Write the failing tests**

`src/base-ui/Input/__tests__/InputGaps.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import Input from '../Input';
import InputNumber from '../InputNumber';
import TextArea from '../TextArea';

const clearButton = () => screen.queryByRole('button', { hidden: true, name: 'Clear' });

describe('Input onPressEnter', () => {
  afterEach(cleanup);

  test('fires on Enter and still calls onKeyDown', () => {
    const onPressEnter = vi.fn();
    const onKeyDown = vi.fn();
    render(<Input aria-label="q" onKeyDown={onKeyDown} onPressEnter={onPressEnter} />);

    fireEvent.keyDown(screen.getByLabelText('q'), { key: 'Enter' });

    expect(onPressEnter).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  test('ignores Enter while an IME is composing', () => {
    const onPressEnter = vi.fn();
    render(<Input aria-label="q" onPressEnter={onPressEnter} />);
    const input = screen.getByLabelText('q');

    fireEvent.keyDown(input, { isComposing: true, key: 'Enter' });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });

    expect(onPressEnter).not.toHaveBeenCalled();
  });
});

describe('Input allowClear', () => {
  afterEach(cleanup);

  test('renders no clear button while empty', () => {
    render(<Input allowClear aria-label="q" />);

    expect(clearButton()).toBeNull();
  });

  test('uncontrolled: clears, keeps focus, reports onChange and onClear', () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(
      <Input
        allowClear
        aria-label="q"
        defaultValue="writer"
        onChange={onChange}
        onClear={onClear}
      />,
    );

    fireEvent.click(clearButton()!);
    const input = screen.getByLabelText('q') as HTMLInputElement;

    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
    expect(clearButton()).toBeNull();
  });

  test('controlled: the DOM follows the parent state', () => {
    const Controlled = ({ accept }: { accept: boolean }) => {
      const [value, setValue] = useState('writer');
      return (
        <Input
          allowClear
          aria-label="q"
          value={value}
          onChange={(event) => accept && setValue(event.target.value)}
        />
      );
    };

    const { unmount } = render(<Controlled accept />);
    fireEvent.click(clearButton()!);
    expect((screen.getByLabelText('q') as HTMLInputElement).value).toBe('');
    unmount();

    render(<Controlled accept={false} />);
    fireEvent.click(clearButton()!);
    expect((screen.getByLabelText('q') as HTMLInputElement).value).toBe('writer');
  });

  test('disabled hides the clear button', () => {
    render(<Input allowClear disabled aria-label="q" defaultValue="writer" />);

    expect(clearButton()).toBeNull();
  });
});

describe('InputNumber gaps', () => {
  afterEach(cleanup);

  test('precision fixes fraction digits', () => {
    render(<InputNumber aria-label="n" defaultValue={4096} precision={2} />);

    expect((screen.getByLabelText('n') as HTMLInputElement).value).toBe('4,096.00');
  });

  test('renders prefix and suffix and fires onPressEnter', () => {
    const onPressEnter = vi.fn();
    render(<InputNumber aria-label="n" prefix="$" suffix="tokens" onPressEnter={onPressEnter} />);

    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('tokens')).toBeTruthy();
    fireEvent.keyDown(screen.getByLabelText('n'), { key: 'Enter' });
    expect(onPressEnter).toHaveBeenCalledTimes(1);
  });
});

describe('TextArea gaps', () => {
  afterEach(cleanup);

  test('showCount with maxLength shows used / max and flags overflow', () => {
    render(<TextArea showCount aria-label="t" defaultValue="hello" maxLength={10} />);

    expect(screen.getByText('5 / 10')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('t'), { target: { value: 'hello world!' } });

    const count = screen.getByText('12 / 10');
    expect(count.hasAttribute('data-over')).toBe(true);
  });

  test('counts an emoji as one character', () => {
    render(<TextArea showCount aria-label="t" defaultValue="😀" />);

    expect(screen.getByText('1')).toBeTruthy();
  });

  test('allowClear empties the textarea', () => {
    render(<TextArea allowClear aria-label="t" defaultValue="draft" />);

    fireEvent.click(clearButton()!);

    expect((screen.getByLabelText('t') as HTMLTextAreaElement).value).toBe('');
  });
});
```

- [ ] **Step 3: Run the tests to see them fail**

Run: `pnpm vitest run src/base-ui/Input/__tests__/InputGaps.test.tsx`
Expected: FAIL (unknown props do nothing; `onPressEnter` never called, no clear button, no count).

- [ ] **Step 4: Add the helpers**

`src/base-ui/Input/pressEnter.ts`:

```ts
import type { KeyboardEvent } from 'react';

export const isPressEnter = (event: KeyboardEvent) =>
  event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229;
```

`src/base-ui/Input/clearNativeValue.ts`:

```ts
export const clearNativeValue = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
  if (!element) return;
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(element, '');
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.focus();
};
```

The native setter plus a bubbling `input` event is what makes React fire `onChange` for both controlled and uncontrolled fields.

`src/base-ui/Input/ClearButton.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { X } from 'lucide-react';
import { memo } from 'react';

import common from '@/i18n/resources/en/common';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { styles } from './style';

interface ClearButtonProps {
  className?: string;
  onClear: () => void;
}

const ClearButton = memo<ClearButtonProps>(({ className, onClear }) => {
  const { t } = useTranslation(common);

  return (
    <button
      data-lobe-input-clear=""
      aria-label={t('common.clear')}
      className={cx(styles.clear, className)}
      tabIndex={-1}
      type="button"
      onClick={onClear}
      onMouseDown={(event) => event.preventDefault()}
    >
      <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />
    </button>
  );
});

ClearButton.displayName = 'InputClearButton';

export default ClearButton;
```

- [ ] **Step 5: Styles**

In `src/base-ui/Input/style.ts`, inside the existing `root` rule append:

```css
&:hover [data-lobe-input-clear],
&:focus-within [data-lobe-input-clear] {
  visibility: visible;
}
```

Add `position: relative;` as the first line of the existing `textarea` rule. Add these rules to the `createStaticStyles` object (alphabetical order with the rest):

```ts
  clear: css`
    cursor: pointer;

    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    color: ${cssVar.colorBgContainer};

    visibility: hidden;
    background: ${cssVar.colorTextQuaternary};

    &:hover {
      background: ${cssVar.colorTextTertiary};
    }
  `,
  count: css`
    pointer-events: none;

    position: absolute;
    inset-block-end: 6px;
    inset-inline-end: 8px;

    display: inline-flex;
    align-items: center;

    height: 20px;
    padding-inline: 8px;
    border-radius: 999px;

    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorFillTertiary};

    &[data-over] {
      color: ${cssVar.colorWhite};
      background: ${cssVar.colorError};
    }
  `,
  textareaClear: css`
    position: absolute;
    inset-block-start: 10px;
    inset-inline-end: 10px;
  `,
  textareaWithCount: css`
    padding-block-end: 30px;
  `,
```

- [ ] **Step 6: Types**

In `src/base-ui/Input/type.ts`:

Add `import type { KeyboardEvent } from 'react';` to the existing React type import list. Add to `InputProps`:

```ts
  allowClear?: boolean;
  onClear?: () => void;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
```

In the `BaseNumberFieldProps` type, add `'prefix'` to the `Omit` list (HTML attributes define `prefix` as a string, which would clash with the ReactNode slot). Then add to `InputNumberProps`:

```ts
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  precision?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
```

Add to `TextAreaProps`:

```ts
  allowClear?: boolean;
  onClear?: () => void;
  onPressEnter?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  showCount?: boolean;
```

- [ ] **Step 7: Input**

Replace the body of `src/base-ui/Input/Input.tsx` with:

```tsx
'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { cx, useThemeMode } from 'antd-style';
import { memo, useRef, useState } from 'react';
import { useMergeRefs } from 'react-merge-refs';

import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { isPressEnter } from './pressEnter';
import { rootVariants, styles } from './style';
import type { InputProps } from './type';

const hasText = (value: unknown) =>
  value !== undefined && value !== null && String(value).length > 0;

const Input = memo<InputProps>(
  ({
    ref,
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    size = 'middle',
    prefix,
    suffix,
    disabled,
    readOnly,
    allowClear,
    onClear,
    onPressEnter,
    onKeyDown,
    onChange,
    value,
    defaultValue,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs([ref, inputRef]);
    const [filled, setFilled] = useState(() => hasText(value ?? defaultValue));
    const isFilled = value === undefined ? filled : hasText(value);
    const showClear = allowClear && isFilled && !disabled && !readOnly;

    return (
      <div
        className={cx(rootVariants({ shadow, size, variant: mergedVariant }), className)}
        data-disabled={disabled ? '' : undefined}
        style={style}
      >
        {prefix && (
          <span className={cx(styles.slot, classNames?.prefix)} style={customStyles?.prefix}>
            {prefix}
          </span>
        )}
        <BaseInput
          className={cx(styles.input, classNames?.input)}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          ref={mergedRef}
          style={customStyles?.input}
          value={value}
          onChange={(event) => {
            setFilled(event.currentTarget.value.length > 0);
            onChange?.(event);
          }}
          onKeyDown={(event) => {
            if (isPressEnter(event)) onPressEnter?.(event);
            onKeyDown?.(event);
          }}
          {...rest}
        />
        {showClear && (
          <ClearButton
            onClear={() => {
              clearNativeValue(inputRef.current);
              onClear?.();
            }}
          />
        )}
        {suffix && (
          <span className={cx(styles.slot, classNames?.suffix)} style={customStyles?.suffix}>
            {suffix}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
```

- [ ] **Step 8: TextArea**

Replace the body of `src/base-ui/Input/TextArea.tsx` with:

```tsx
'use client';

import { Field } from '@base-ui/react/field';
import { cx, useThemeMode } from 'antd-style';
import { type CSSProperties, memo, useMemo, useRef, useState } from 'react';
import { useMergeRefs } from 'react-merge-refs';

import ClearButton from './ClearButton';
import { clearNativeValue } from './clearNativeValue';
import { isPressEnter } from './pressEnter';
import { rootVariants, styles } from './style';
import type { TextAreaProps } from './type';

const textLength = (value: unknown) =>
  value === undefined || value === null ? 0 : Array.from(String(value)).length;

const TextArea = memo<TextAreaProps>(
  ({
    ref,
    className,
    classNames,
    styles: customStyles,
    style,
    variant,
    shadow,
    autoSize,
    resize = false,
    disabled,
    readOnly,
    allowClear,
    onClear,
    onPressEnter,
    onKeyDown,
    onChange,
    showCount,
    maxLength,
    value,
    defaultValue,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();
    const mergedVariant = variant || (isDarkMode ? 'filled' : 'outlined');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergeRefs([ref, textareaRef]);
    const [innerLength, setInnerLength] = useState(() => textLength(value ?? defaultValue));
    const length = value === undefined ? innerLength : textLength(value);
    const showClear = allowClear && length > 0 && !disabled && !readOnly;
    const over = maxLength !== undefined && length > maxLength;

    const cssVariables = useMemo<CSSProperties>(() => {
      if (typeof autoSize !== 'object') return {};
      return {
        '--textarea-max-height': autoSize.maxRows ? `calc(1.5em * ${autoSize.maxRows})` : undefined,
        '--textarea-min-rows': autoSize.minRows,
      } as CSSProperties;
    }, [autoSize]);

    return (
      <div
        data-disabled={disabled ? '' : undefined}
        style={{ ...cssVariables, ...style }}
        className={cx(
          rootVariants({ shadow, variant: mergedVariant }),
          styles.textarea,
          autoSize && styles.textareaAutoSize,
          resize && styles.textareaResize,
          showCount && styles.textareaWithCount,
          className,
        )}
      >
        <Field.Control
          className={cx(styles.input, classNames?.input)}
          disabled={disabled}
          style={customStyles?.input}
          render={
            <textarea
              defaultValue={defaultValue}
              maxLength={maxLength}
              readOnly={readOnly}
              ref={mergedRef}
              value={value}
              onChange={(event) => {
                setInnerLength(textLength(event.currentTarget.value));
                onChange?.(event);
              }}
              onKeyDown={(event) => {
                if (isPressEnter(event)) onPressEnter?.(event);
                onKeyDown?.(event);
              }}
              {...rest}
            />
          }
        />
        {showClear && (
          <ClearButton
            className={styles.textareaClear}
            onClear={() => {
              clearNativeValue(textareaRef.current);
              onClear?.();
            }}
          />
        )}
        {showCount && (
          <span className={styles.count} data-over={over ? '' : undefined}>
            {maxLength === undefined ? length : `${length} / ${maxLength}`}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
```

- [ ] **Step 9: InputNumber**

In `src/base-ui/Input/InputNumber.tsx`:

1. Add imports: `import { isPressEnter } from './pressEnter';`
2. Add `format`, `precision`, `prefix`, `suffix`, `onPressEnter` to the destructured props (after `placeholder`). Leave `onKeyDown` in `rest`: it belongs to the root `div`, not the input.
3. Before `return`, add:

```ts
const mergedFormat =
  precision === undefined
    ? format
    : { ...format, maximumFractionDigits: precision, minimumFractionDigits: precision };
```

4. Pass `format={mergedFormat}` to `NumberField.Root`.
5. Render `prefix` before and `suffix` after `NumberField.Input`, and add the key handler:

```tsx
{
  prefix && <span className={styles.slot}>{prefix}</span>;
}
<NumberField.Input
  className={cx(styles.input, styles.numberInput, classNames?.input)}
  placeholder={placeholder}
  ref={ref}
  style={customStyles?.input}
  onKeyDown={(event) => {
    if (isPressEnter(event)) onPressEnter?.(event);
  }}
/>;
{
  suffix && <span className={styles.slot}>{suffix}</span>;
}
```

- [ ] **Step 10: Run the tests**

Run: `pnpm vitest run src/base-ui/Input`
Expected: PASS (new file and the existing Input tests).

- [ ] **Step 11: Document the new props**

Append to `src/base-ui/Input/index.md` a section:

```md
## Clear, Enter and counting

- `allowClear` shows a round clear button while the field has a value and is hovered or focused; `onClear` fires after the value is emptied. Focus stays in the field.
- `onPressEnter` fires on Enter, but not while an IME is composing, so confirming a Chinese or Japanese candidate never submits.
- `InputNumber` formats through `format` (`Intl.NumberFormatOptions`); `precision` fixes the fraction digits; `prefix` / `suffix` hold units.
- `TextArea` `showCount` renders the character count (emoji count as one), `used / maxLength` when `maxLength` is set.
```

- [ ] **Step 12: Lint and commit**

Run: `pnpm exec eslint src/base-ui/Input src/i18n/resources/en/common.ts src/i18n/resources/zhCn/common.ts`
Expected: no errors.

```bash
git add src/base-ui/Input src/i18n/resources/en/common.ts src/i18n/resources/zhCn/common.ts
git commit -m "✨ feat(base-ui): Input allowClear, IME-safe onPressEnter, InputNumber precision, TextArea showCount"
```

---

### Task 3: Calendar core (pure date logic)

**Files:**

- Create: `src/base-ui/DatePicker/calendar.ts`
- Test: `src/base-ui/DatePicker/__tests__/calendar.test.ts`

**Interfaces:**

- Produces (all from `src/base-ui/DatePicker/calendar.ts`):
  - `type CalendarMode = 'date' | 'month' | 'year'`
  - `interface DateBounds { disabledDate?: (date: Date) => boolean; max?: Date; min?: Date }`
  - `getWeekStart(): number`
  - `buildMonthGrid(month: Date, weekStart?: number): Date[]` (always 42 days)
  - `getWeekdayLabels(weekStart?: number): string[]`
  - `isSameDay(a?: Date | null, b?: Date | null): boolean`
  - `isDayDisabled(date: Date, bounds: DateBounds): boolean`
  - `isMonthDisabled(month: Date, bounds: DateBounds): boolean`
  - `isYearDisabled(year: Date, bounds: DateBounds): boolean`
  - `moveDayFocus(date: Date, key: string, weekStart?: number): Date | null`
  - `orderRange(a: Date, b: Date): [Date, Date]`
  - `DEFAULT_FORMAT: Record<CalendarMode, string>`

- [ ] **Step 1: Write the failing tests**

`src/base-ui/DatePicker/__tests__/calendar.test.ts`:

```ts
import {
  buildMonthGrid,
  getWeekdayLabels,
  isDayDisabled,
  isMonthDisabled,
  isSameDay,
  moveDayFocus,
  orderRange,
} from '../calendar';

const day = (y: number, m: number, d: number) => new Date(y, m, d);

describe('buildMonthGrid', () => {
  test('always 42 days, starting on the week start', () => {
    const sunday = buildMonthGrid(day(2026, 9, 1), 0);
    expect(sunday).toHaveLength(42);
    expect(isSameDay(sunday[0], day(2026, 8, 27))).toBe(true);
    expect(isSameDay(sunday[41], day(2026, 10, 7))).toBe(true);

    const monday = buildMonthGrid(day(2026, 9, 1), 1);
    expect(isSameDay(monday[0], day(2026, 8, 28))).toBe(true);
  });

  test('a month that starts on the week start begins on the 1st', () => {
    const grid = buildMonthGrid(day(2026, 1, 1), 0);
    expect(isSameDay(grid[0], day(2026, 1, 1))).toBe(true);
  });
});

describe('getWeekdayLabels', () => {
  test('rotates with the week start', () => {
    expect(getWeekdayLabels(0)[0]).toBe('Su');
    expect(getWeekdayLabels(1)[0]).toBe('Mo');
    expect(getWeekdayLabels(1)[6]).toBe('Su');
  });
});

describe('bounds', () => {
  test('compares by calendar day even when min carries a time of day', () => {
    const min = new Date(2026, 9, 8, 15, 42);
    expect(isDayDisabled(day(2026, 9, 8), { min })).toBe(false);
    expect(isDayDisabled(day(2026, 9, 7), { min })).toBe(true);
  });

  test('max and disabledDate', () => {
    const max = day(2026, 9, 20);
    expect(isDayDisabled(day(2026, 9, 21), { max })).toBe(true);
    expect(isDayDisabled(day(2026, 9, 10), { disabledDate: (d) => d.getDate() === 10 })).toBe(true);
  });

  test('months outside min / max', () => {
    const bounds = { max: day(2026, 11, 31), min: day(2026, 9, 15) };
    expect(isMonthDisabled(day(2026, 8, 1), bounds)).toBe(true);
    expect(isMonthDisabled(day(2026, 9, 1), bounds)).toBe(false);
  });
});

describe('moveDayFocus', () => {
  test('arrow, page and home / end keys', () => {
    const from = day(2026, 9, 15);
    expect(isSameDay(moveDayFocus(from, 'ArrowRight', 0), day(2026, 9, 16))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'ArrowUp', 0), day(2026, 9, 8))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'PageDown', 0), day(2026, 10, 15))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'Home', 0), day(2026, 9, 11))).toBe(true);
    expect(isSameDay(moveDayFocus(from, 'End', 0), day(2026, 9, 17))).toBe(true);
    expect(moveDayFocus(from, 'a', 0)).toBeNull();
  });
});

describe('orderRange', () => {
  test('returns the earlier date first', () => {
    const [start, end] = orderRange(day(2026, 9, 8), day(2026, 8, 22));
    expect(isSameDay(start, day(2026, 8, 22))).toBe(true);
    expect(isSameDay(end, day(2026, 9, 8))).toBe(true);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm vitest run src/base-ui/DatePicker/__tests__/calendar.test.ts`
Expected: FAIL, "Cannot find module '../calendar'".

- [ ] **Step 3: Implement**

`src/base-ui/DatePicker/calendar.ts`:

```ts
import dayjs from 'dayjs';

export type CalendarMode = 'date' | 'month' | 'year';

export interface DateBounds {
  disabledDate?: (date: Date) => boolean;
  max?: Date;
  min?: Date;
}

export const DEFAULT_FORMAT: Record<CalendarMode, string> = {
  date: 'MMM D, YYYY',
  month: 'MMMM YYYY',
  year: 'YYYY',
};

export const getWeekStart = (): number => {
  const locales = (dayjs as unknown as { Ls: Record<string, { weekStart?: number }> }).Ls;
  return locales[dayjs.locale()]?.weekStart ?? 0;
};

const offsetFromWeekStart = (date: Date, weekStart: number) =>
  (dayjs(date).day() - weekStart + 7) % 7;

export const buildMonthGrid = (month: Date, weekStart = getWeekStart()): Date[] => {
  const first = dayjs(month).startOf('month');
  const start = first.subtract(offsetFromWeekStart(first.toDate(), weekStart), 'day');
  return Array.from({ length: 42 }, (_, index) => start.add(index, 'day').toDate());
};

export const getWeekdayLabels = (weekStart = getWeekStart()): string[] =>
  Array.from({ length: 7 }, (_, index) =>
    dayjs()
      .day((weekStart + index) % 7)
      .format('dd'),
  );

export const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && dayjs(a).isSame(b, 'day');

export const isDayDisabled = (date: Date, { disabledDate, max, min }: DateBounds) =>
  (!!min && dayjs(date).isBefore(min, 'day')) ||
  (!!max && dayjs(date).isAfter(max, 'day')) ||
  !!disabledDate?.(date);

export const isMonthDisabled = (month: Date, { max, min }: DateBounds) =>
  (!!min && dayjs(month).isBefore(min, 'month')) || (!!max && dayjs(month).isAfter(max, 'month'));

export const isYearDisabled = (year: Date, { max, min }: DateBounds) =>
  (!!min && dayjs(year).isBefore(min, 'year')) || (!!max && dayjs(year).isAfter(max, 'year'));

export const moveDayFocus = (date: Date, key: string, weekStart = getWeekStart()): Date | null => {
  const current = dayjs(date);
  const offset = offsetFromWeekStart(date, weekStart);
  switch (key) {
    case 'ArrowLeft': {
      return current.subtract(1, 'day').toDate();
    }
    case 'ArrowRight': {
      return current.add(1, 'day').toDate();
    }
    case 'ArrowUp': {
      return current.subtract(7, 'day').toDate();
    }
    case 'ArrowDown': {
      return current.add(7, 'day').toDate();
    }
    case 'PageUp': {
      return current.subtract(1, 'month').toDate();
    }
    case 'PageDown': {
      return current.add(1, 'month').toDate();
    }
    case 'Home': {
      return current.subtract(offset, 'day').toDate();
    }
    case 'End': {
      return current.add(6 - offset, 'day').toDate();
    }
    default: {
      return null;
    }
  }
};

export const orderRange = (a: Date, b: Date): [Date, Date] =>
  dayjs(a).isAfter(b, 'day') ? [b, a] : [a, b];
```

- [ ] **Step 4: Run the tests**

Run: `pnpm vitest run src/base-ui/DatePicker/__tests__/calendar.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/base-ui/DatePicker/calendar.ts src/base-ui/DatePicker/__tests__/calendar.test.ts
git commit -m "✨ feat(base-ui): add calendar grid and date bound helpers"
```

---

### Task 4: Panel styles, CalendarPanel and DatePicker

**Files:**

- Create: `src/base-ui/panelStyles.ts`
- Create: `src/i18n/resources/en/datePicker.ts`, `src/i18n/resources/zhCn/datePicker.ts`
- Modify: `src/i18n/resources/en/index.ts`, `src/i18n/resources/zhCn/index.ts`, `src/i18n/types.ts`
- Create: `src/base-ui/DatePicker/style.ts`, `src/base-ui/DatePicker/type.ts`, `src/base-ui/DatePicker/CalendarPanel.tsx`, `src/base-ui/DatePicker/PickerShell.tsx`, `src/base-ui/DatePicker/DatePicker.tsx`, `src/base-ui/DatePicker/index.ts`
- Modify: `src/base-ui/index.ts`
- Test: `src/base-ui/DatePicker/__tests__/DatePicker.test.tsx`

**Interfaces:**

- Consumes: Task 3 helpers; `ClearButton` from Task 2; Popover atoms from `@/base-ui/Popover`.
- Produces:
  - `panelStyles` from `src/base-ui/panelStyles.ts` with keys `popup`, `title`, `titleMuted`, `label`, `nav`, `pill`, `pillGhost`. Tasks 6 and 7 use `popup`, `label`, `nav`, `pill`, `pillGhost`.
  - `CalendarPanel` props: `{ bounds: DateBounds; mode: CalendarMode; month: Date; onMonthChange: (month: Date) => void; onSelect: (date: Date) => void; selected?: Date | null; range?: [Date | null, Date | null]; hovered?: Date | null; onHover?: (date: Date | null) => void; showNav?: boolean }`
  - `PickerShell` props: `{ children: ReactNode (popup content); open: boolean; onOpenChange: (open: boolean) => void; trigger: ReactNode; showClear: boolean; onClear: () => void; disabled?: boolean; size?: InputSize; variant?: InputVariant; shadow?: boolean; className?: string; style?: CSSProperties }`
  - `DatePickerProps`, `DateRangePickerProps` in `type.ts` (Task 5 implements the range component).

- [ ] **Step 1: i18n namespace**

`src/i18n/resources/en/datePicker.ts`:

```ts
export default {
  'datePicker.endPlaceholder': 'End date',
  'datePicker.monthPlaceholder': 'Select month',
  'datePicker.next': 'Next',
  'datePicker.placeholder': 'Select date',
  'datePicker.previous': 'Previous',
  'datePicker.startPlaceholder': 'Start date',
  'datePicker.yearPlaceholder': 'Select year',
} as const;
```

`src/i18n/resources/zhCn/datePicker.ts`:

```ts
export default {
  'datePicker.endPlaceholder': '结束日期',
  'datePicker.monthPlaceholder': '选择月份',
  'datePicker.next': '下一页',
  'datePicker.placeholder': '选择日期',
  'datePicker.previous': '上一页',
  'datePicker.startPlaceholder': '开始日期',
  'datePicker.yearPlaceholder': '选择年份',
} as const;
```

Add `export { default as datePicker } from './datePicker';` to both `en/index.ts` and `zhCn/index.ts` (alphabetical). In `src/i18n/types.ts` add `typeof import('./resources/en/datePicker').default &` to `BuiltinTranslationResources` (alphabetical, after `common`).

- [ ] **Step 2: Shared panel styles**

`src/base-ui/panelStyles.ts`:

```ts
import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const panelStyles = createStaticStyles(({ css, cssVar }) => ({
  label: css`
    font-size: 10px;
    font-weight: 600;
    color: ${cssVar.colorTextTertiary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  `,
  nav: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    color: ${cssVar.colorTextSecondary};

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  pill: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;

    height: 32px;
    padding-inline: 14px;
    border: 0;
    border-radius: 999px;

    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: ${cssVar.colorBgContainer};

    background: ${cssVar.colorText};
  `,
  pillGhost: css`
    color: ${cssVar.colorText};
    background: ${cssVar.colorFillTertiary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  popup: css`
    padding: 16px;
    border-radius: 16px;
    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadow}, var(--lobe-ring);
  `,
  title: css`
    ${focusRing};
    cursor: pointer;

    padding: 0;
    border: 0;

    font: inherit;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
    color: ${cssVar.colorText};
    text-align: start;
    letter-spacing: -0.01em;

    background: none;
  `,
  titleMuted: css`
    font-weight: 400;
    color: ${cssVar.colorTextTertiary};
  `,
}));
```

- [ ] **Step 3: Types**

`src/base-ui/DatePicker/type.ts`:

```ts
import type { CSSProperties, ReactNode } from 'react';

import type { InputSize, InputVariant } from '@/base-ui/Input/type';

import type { CalendarMode } from './calendar';

interface PickerCommonProps {
  allowClear?: boolean;
  className?: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  format?: string | ((date: Date) => string);
  max?: Date;
  min?: Date;
  shadow?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  variant?: InputVariant;
}

export interface DatePickerProps extends PickerCommonProps {
  defaultValue?: Date | null;
  footer?: ReactNode;
  mode?: CalendarMode;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  value?: Date | null;
}

export type DateRangeValue = [Date | null, Date | null];

export interface DateRangePickerProps extends PickerCommonProps {
  defaultValue?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  placeholder?: [string, string];
  value?: DateRangeValue;
}

export type { CalendarMode } from './calendar';
```

Check `InputSize` and `InputVariant` are exported from `src/base-ui/Input/type.ts` (they are, lines 6-7).

- [ ] **Step 4: Styles**

`src/base-ui/DatePicker/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  band: css`
    background: ${cssVar.colorFillSecondary};
  `,
  bandEnd: css`
    background: linear-gradient(to left, transparent 50%, ${cssVar.colorFillSecondary} 50%);
  `,
  bandStart: css`
    background: linear-gradient(to right, transparent 50%, ${cssVar.colorFillSecondary} 50%);
  `,
  calendar: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 266px;
  `,
  cell: css`
    display: flex;
    justify-content: center;
  `,
  day: css`
    ${focusRing};
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    font: inherit;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorText};

    background: none;

    &:hover:not(:disabled, [aria-pressed='true']) {
      background: ${cssVar.colorFillTertiary};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
    }

    &[data-outside] {
      color: ${cssVar.colorTextQuaternary};
    }

    &[data-today] {
      box-shadow: inset 0 0 0 1px ${cssVar.colorText};
    }

    &[aria-pressed='true'] {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }
  `,
  footer: css`
    display: flex;
    justify-content: center;
    margin-block-start: 12px;
    padding-block-start: 12px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    row-gap: 2px;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 4px;
  `,
  icon: css`
    display: inline-flex;
    flex: none;
    color: ${cssVar.colorTextTertiary};
  `,
  navGroup: css`
    display: flex;
    gap: 2px;
  `,
  placeholder: css`
    color: ${cssVar.colorTextPlaceholder};
  `,
  range: css`
    display: flex;
    gap: 28px;
  `,
  rangeHalf: css`
    min-width: 0;
    padding-block: 2px;

    &[data-active] {
      box-shadow: inset 0 -2px 0 ${cssVar.colorText};
    }
  `,
  rangeTrigger: css`
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;
    min-width: 0;
  `,
  tile: css`
    ${focusRing};
    cursor: pointer;

    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 999px;

    font: inherit;
    font-size: 14px;
    color: ${cssVar.colorText};

    background: none;

    &:hover:not(:disabled, [aria-pressed='true']) {
      background: ${cssVar.colorFillTertiary};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
    }

    &[data-today] {
      box-shadow: inset 0 0 0 1px ${cssVar.colorText};
    }

    &[aria-pressed='true'] {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }
  `,
  tiles: css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px 4px;
    width: 266px;
  `,
  trigger: css`
    ${focusRing};
    cursor: pointer;

    display: flex;
    flex: 1;
    align-items: center;

    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;

    font: inherit;
    color: inherit;
    text-align: start;
    white-space: nowrap;

    background: none;

    &:disabled {
      cursor: not-allowed;
    }
  `,
  weekday: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
  `,
}));
```

- [ ] **Step 5: Write the failing component tests**

`src/base-ui/DatePicker/__tests__/DatePicker.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import DatePicker from '../DatePicker';

const open = () =>
  fireEvent.click(screen.getByRole('button', { name: /Oct 15, 2026|Select date/ }));

describe('DatePicker', () => {
  afterEach(cleanup);

  test('shows the placeholder, then the formatted value', () => {
    const { rerender } = render(<DatePicker />);
    expect(screen.getByText('Select date')).toBeTruthy();

    rerender(<DatePicker value={new Date(2026, 9, 15, 9, 30)} />);
    expect(screen.getByText('Oct 15, 2026')).toBeTruthy();
  });

  test('picking a day emits a Date and closes', async () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} onChange={onChange} />);

    open();
    fireEvent.click(screen.getByRole('button', { name: 'October 21, 2026' }));

    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(9);
    expect(picked.getDate()).toBe(21);
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
  });

  test('days before min are disabled even when min has a time', () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} min={new Date(2026, 9, 8, 15, 42)} />);

    open();

    expect(
      (screen.getByRole('button', { name: 'October 7, 2026' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'October 8, 2026' }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  test('mode="month" opens on month tiles and emits the first of the month', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 9, 1)} mode="month" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'October 2026' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nov' }));

    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getMonth()).toBe(10);
    expect(picked.getDate()).toBe(1);
  });

  test('arrow keys move focus between days', () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} />);

    open();
    const start = screen.getByRole('button', { name: 'October 15, 2026' });
    start.focus();
    fireEvent.keyDown(start, { key: 'ArrowRight' });

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'October 16, 2026' }));
  });

  test('footer renders under the grid', () => {
    render(
      <DatePicker
        defaultValue={new Date(2026, 9, 15)}
        footer={<button type="button">Never expires</button>}
      />,
    );

    open();

    expect(screen.getByRole('button', { name: 'Never expires' })).toBeTruthy();
  });

  test('clear emits null', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { hidden: true, name: 'Clear' }));

    expect(onChange.mock.calls[0][0]).toBeNull();
    expect(screen.getByText('Select date')).toBeTruthy();
  });
});
```

Day buttons carry `aria-label` = `dayjs(date).format('MMMM D, YYYY')`; month tiles carry the short month name as text. In `mode="month"` the trigger reads `October 2026` and the popup opens directly on month tiles. `use-merge-value` calls `onChange(next, prev)`, so assert on `mock.calls[0][0]` rather than `toHaveBeenCalledWith(single)`.

- [ ] **Step 6: Run to see it fail**

Run: `pnpm vitest run src/base-ui/DatePicker/__tests__/DatePicker.test.tsx`
Expected: FAIL, "Cannot find module '../DatePicker'".

- [ ] **Step 7: CalendarPanel**

`src/base-ui/DatePicker/CalendarPanel.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { panelStyles } from '@/base-ui/panelStyles';
import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import {
  buildMonthGrid,
  type CalendarMode,
  type DateBounds,
  getWeekdayLabels,
  getWeekStart,
  isDayDisabled,
  isMonthDisabled,
  isSameDay,
  isYearDisabled,
  moveDayFocus,
  orderRange,
} from './calendar';
import { styles } from './style';

export interface CalendarPanelProps {
  bounds: DateBounds;
  hovered?: Date | null;
  mode: CalendarMode;
  month: Date;
  onHover?: (date: Date | null) => void;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
  range?: [Date | null, Date | null];
  selected?: Date | null;
  showNav?: boolean;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

const CalendarPanel = memo<CalendarPanelProps>(
  ({
    bounds,
    hovered,
    mode,
    month,
    onHover,
    onMonthChange,
    onSelect,
    range,
    selected,
    showNav = true,
  }) => {
    const { t } = useTranslation(datePickerMessages);
    const [view, setView] = useState<CalendarMode>(mode);
    const [focused, setFocused] = useState<Date>(selected ?? month);
    const gridRef = useRef<HTMLDivElement>(null);
    const weekStart = getWeekStart();
    const today = new Date();
    const current = dayjs(month);
    const decadeStart = Math.floor(current.year() / 12) * 12;
    const focusDay = dayjs(focused).isSame(month, 'month')
      ? focused
      : current.startOf('month').toDate();

    useEffect(() => {
      const target = gridRef.current?.querySelector<HTMLButtonElement>('[data-focus-target]');
      if (target && gridRef.current?.contains(document.activeElement)) target.focus();
    }, [focused]);

    const step = (direction: 1 | -1) => {
      const unit = view === 'date' ? 'month' : 'year';
      const amount = view === 'year' ? 12 * direction : direction;
      onMonthChange(current.add(amount, unit).toDate());
    };

    const drillUp = () => setView(view === 'date' ? 'month' : 'year');

    const handleDayKey = (event: KeyboardEvent<HTMLButtonElement>) => {
      const next = moveDayFocus(focusDay, event.key, weekStart);
      if (!next) return;
      event.preventDefault();
      setFocused(next);
      if (!dayjs(next).isSame(month, 'month')) onMonthChange(next);
    };

    const band = (() => {
      if (!range?.[0]) return null;
      const end = range[1] ?? hovered;
      return end ? orderRange(range[0], end) : null;
    })();

    const renderDays = () => {
      const days = buildMonthGrid(month, weekStart);
      return (
        <div
          aria-label={current.format('MMMM YYYY')}
          className={styles.grid}
          ref={gridRef}
          role="grid"
          onMouseLeave={() => onHover?.(null)}
        >
          {getWeekdayLabels(weekStart).map((label) => (
            <span className={cx(styles.weekday, panelStyles.label)} key={label} role="columnheader">
              {label}
            </span>
          ))}
          {days.map((date) => {
            const outside = !dayjs(date).isSame(month, 'month');
            const isStart = !outside && !!band && isSameDay(date, band[0]);
            const isEnd = !outside && !!band && isSameDay(date, band[1]);
            const inBand =
              !outside &&
              !!band &&
              dayjs(date).isAfter(band[0], 'day') &&
              dayjs(date).isBefore(band[1], 'day');
            const pressed = !outside && (isSameDay(date, selected) || isStart || isEnd);
            const focusTarget = isSameDay(date, focusDay) && !outside;

            return (
              <span
                aria-selected={pressed}
                key={date.toISOString()}
                role="gridcell"
                className={cx(
                  styles.cell,
                  inBand && styles.band,
                  isStart && !isEnd && styles.bandStart,
                  isEnd && !isStart && styles.bandEnd,
                )}
              >
                <button
                  aria-label={dayjs(date).format('MMMM D, YYYY')}
                  aria-pressed={pressed}
                  className={styles.day}
                  data-focus-target={focusTarget ? '' : undefined}
                  data-outside={outside ? '' : undefined}
                  data-today={isSameDay(date, today) ? '' : undefined}
                  disabled={isDayDisabled(date, bounds)}
                  tabIndex={focusTarget ? 0 : -1}
                  type="button"
                  onClick={() => onSelect(dayjs(date).startOf('day').toDate())}
                  onKeyDown={handleDayKey}
                  onMouseEnter={() => onHover?.(date)}
                >
                  {date.getDate()}
                </button>
              </span>
            );
          })}
        </div>
      );
    };

    const renderMonths = () => (
      <div className={styles.tiles}>
        {MONTHS.map((index) => {
          const date = current.month(index).startOf('month').toDate();
          return (
            <button
              aria-pressed={!!selected && dayjs(selected).isSame(date, 'month')}
              className={styles.tile}
              data-today={dayjs(today).isSame(date, 'month') ? '' : undefined}
              disabled={isMonthDisabled(date, bounds)}
              key={index}
              type="button"
              onClick={() => {
                if (mode === 'month') return onSelect(date);
                onMonthChange(date);
                setView('date');
              }}
            >
              {dayjs(date).format('MMM')}
            </button>
          );
        })}
      </div>
    );

    const renderYears = () => (
      <div className={styles.tiles}>
        {MONTHS.map((index) => {
          const date = dayjs(new Date(decadeStart + index, 0, 1)).toDate();
          return (
            <button
              aria-pressed={!!selected && dayjs(selected).isSame(date, 'year')}
              className={styles.tile}
              data-today={dayjs(today).isSame(date, 'year') ? '' : undefined}
              disabled={isYearDisabled(date, bounds)}
              key={index}
              type="button"
              onClick={() => {
                if (mode === 'year') return onSelect(date);
                onMonthChange(current.year(decadeStart + index).toDate());
                setView('month');
              }}
            >
              {decadeStart + index}
            </button>
          );
        })}
      </div>
    );

    const title = (() => {
      if (view === 'date')
        return (
          <>
            {current.format('MMMM')}{' '}
            <span className={panelStyles.titleMuted}>{current.format('YYYY')}</span>
          </>
        );
      if (view === 'month') return current.format('YYYY');
      return `${decadeStart} – ${decadeStart + 11}`;
    })();

    return (
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button
            className={panelStyles.title}
            disabled={view === 'year'}
            type="button"
            onClick={drillUp}
          >
            {title}
          </button>
          {showNav && (
            <div className={styles.navGroup}>
              <button
                aria-label={t('datePicker.previous')}
                className={panelStyles.nav}
                type="button"
                onClick={() => step(-1)}
              >
                <Icon icon={ChevronLeft} size={14} />
              </button>
              <button
                aria-label={t('datePicker.next')}
                className={panelStyles.nav}
                type="button"
                onClick={() => step(1)}
              >
                <Icon icon={ChevronRight} size={14} />
              </button>
            </div>
          )}
        </div>
        {view === 'date' && renderDays()}
        {view === 'month' && renderMonths()}
        {view === 'year' && renderYears()}
      </div>
    );
  },
);

CalendarPanel.displayName = 'CalendarPanel';

export default CalendarPanel;
```

The header title's accessible name in date view is `October 2026` (the inner span text joins with a space).

- [ ] **Step 8: PickerShell (trigger shell + popup)**

`src/base-ui/DatePicker/PickerShell.tsx`:

```tsx
'use client';

import { cx, useThemeMode } from 'antd-style';
import { type CSSProperties, memo, type ReactElement, type ReactNode, useRef } from 'react';

import ClearButton from '@/base-ui/Input/ClearButton';
import { rootVariants } from '@/base-ui/Input/style';
import type { InputSize, InputVariant } from '@/base-ui/Input/type';
import { panelStyles } from '@/base-ui/panelStyles';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/base-ui/Popover';

export interface PickerShellProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon: ReactNode;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  shadow?: boolean;
  showClear: boolean;
  size?: InputSize;
  style?: CSSProperties;
  trigger: ReactElement;
  variant?: InputVariant;
}

const PickerShell = memo<PickerShellProps>(
  ({
    children,
    className,
    disabled,
    icon,
    onClear,
    onOpenChange,
    open,
    shadow,
    showClear,
    size = 'middle',
    style,
    trigger,
    variant,
  }) => {
    const { isDarkMode } = useThemeMode();
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div
        className={cx(
          rootVariants({ shadow, size, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        ref={anchorRef}
        style={style}
      >
        <PopoverRoot open={open} onOpenChange={(next) => !disabled && onOpenChange(next)}>
          <PopoverTriggerElement>{trigger}</PopoverTriggerElement>
          <PopoverPortal>
            <PopoverPositioner anchor={anchorRef} placement="bottomLeft">
              <PopoverPopup className={panelStyles.popup}>{children}</PopoverPopup>
            </PopoverPositioner>
          </PopoverPortal>
        </PopoverRoot>
        {showClear && !disabled ? <ClearButton onClear={onClear} /> : icon}
      </div>
    );
  },
);

PickerShell.displayName = 'PickerShell';

export default PickerShell;
```

`ClearButton` is rendered in place of the calendar icon when there is a value; the Input shell's hover rule from Task 2 reveals it.

- [ ] **Step 9: DatePicker**

`src/base-ui/DatePicker/DatePicker.tsx`:

```tsx
'use client';

import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { DEFAULT_FORMAT } from './calendar';
import CalendarPanel from './CalendarPanel';
import PickerShell from './PickerShell';
import { styles } from './style';
import type { DatePickerProps } from './type';

const PLACEHOLDER_KEY = {
  date: 'datePicker.placeholder',
  month: 'datePicker.monthPlaceholder',
  year: 'datePicker.yearPlaceholder',
} as const;

export const formatDate = (date: Date, format: DatePickerProps['format'], fallback: string) =>
  typeof format === 'function' ? format(date) : dayjs(date).format(format ?? fallback);

const DatePicker = memo<DatePickerProps>(
  ({
    allowClear = true,
    className,
    defaultValue = null,
    disabled,
    disabledDate,
    footer,
    format,
    max,
    min,
    mode = 'date',
    onChange,
    placeholder,
    shadow,
    size,
    style,
    value,
    variant,
  }) => {
    const { t } = useTranslation(datePickerMessages);
    const [current, setCurrent] = useControlledState<Date | null>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date>(() => current ?? new Date());

    const text = current ? formatDate(current, format, DEFAULT_FORMAT[mode]) : null;

    return (
      <PickerShell
        className={className}
        disabled={disabled}
        icon={
          <span className={styles.icon}>
            <Icon icon={CalendarIcon} size={14} />
          </span>
        }
        open={open}
        shadow={shadow}
        showClear={allowClear && !!current}
        size={size}
        style={style}
        variant={variant}
        trigger={
          <button className={styles.trigger} disabled={disabled} type="button">
            {text ?? (
              <span className={styles.placeholder}>{placeholder ?? t(PLACEHOLDER_KEY[mode])}</span>
            )}
          </button>
        }
        onClear={() => setCurrent(null)}
        onOpenChange={(next) => {
          if (next) setMonth(current ?? new Date());
          setOpen(next);
        }}
      >
        <CalendarPanel
          bounds={{ disabledDate, max, min }}
          mode={mode}
          month={month}
          selected={current}
          onMonthChange={setMonth}
          onSelect={(date) => {
            setCurrent(date);
            setOpen(false);
          }}
        />
        {footer && <div className={styles.footer}>{footer}</div>}
      </PickerShell>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
```

`use-merge-value` calls `onChange(next, prev)`; the extra argument is harmless for `(date: Date | null) => void`.

- [ ] **Step 10: Index and base-ui export**

`src/base-ui/DatePicker/index.ts`:

```ts
export { default as DatePicker } from './DatePicker';
export type { CalendarMode, DatePickerProps, DateRangePickerProps, DateRangeValue } from './type';
```

In `src/base-ui/index.ts` add, keeping the alphabetical order (after `controlSize`):

```ts
export * from './DatePicker';
```

- [ ] **Step 11: Run the tests**

Run: `pnpm vitest run src/base-ui/DatePicker`
Expected: PASS. If the popup does not render in jsdom after the trigger click, check `src/base-ui/Popover/__tests__` for the pattern used there (they open with `fireEvent.click` on the trigger) and match it.

- [ ] **Step 12: Lint and commit**

Run: `pnpm exec eslint src/base-ui/DatePicker src/base-ui/panelStyles.ts src/base-ui/index.ts src/i18n`
Expected: no errors.

```bash
git add src/base-ui/DatePicker src/base-ui/panelStyles.ts src/base-ui/index.ts src/i18n
git commit -m "✨ feat(base-ui): add DatePicker"
```

---

### Task 5: DateRangePicker, docs and demos

**Files:**

- Create: `src/base-ui/DatePicker/DateRangePicker.tsx`
- Modify: `src/base-ui/DatePicker/index.ts`
- Create: `src/base-ui/DatePicker/index.mdx`, `src/base-ui/DatePicker/demos/index.tsx`, `src/base-ui/DatePicker/demos/range.tsx`
- Test: `src/base-ui/DatePicker/__tests__/DateRangePicker.test.tsx`

**Interfaces:**

- Consumes: `CalendarPanel`, `PickerShell`, `formatDate` (Task 4), `orderRange` (Task 3).
- Produces: `DateRangePicker` exported from `src/base-ui/DatePicker/index.ts`.

- [ ] **Step 1: Write the failing tests**

`src/base-ui/DatePicker/__tests__/DateRangePicker.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import DateRangePicker from '../DateRangePicker';

const openAt = (text: string) =>
  fireEvent.click(screen.getByRole('button', { name: new RegExp(text) }));
const pick = (label: string) => fireEvent.click(screen.getAllByRole('button', { name: label })[0]);

describe('DateRangePicker', () => {
  afterEach(cleanup);

  test('renders two months and both placeholders', () => {
    render(<DateRangePicker />);

    expect(screen.getByText('Start date')).toBeTruthy();
    expect(screen.getByText('End date')).toBeTruthy();

    openAt('Start date');
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  test('emits an ordered pair even when the end is picked first', () => {
    const onChange = vi.fn();
    render(<DateRangePicker defaultValue={[new Date(2026, 9, 1), null]} onChange={onChange} />);

    openAt('Oct 1, 2026');
    pick('October 20, 2026');
    pick('October 8, 2026');

    const [start, end] = onChange.mock.calls.at(-1)![0] as [Date, Date];
    expect(start.getDate()).toBe(8);
    expect(end.getDate()).toBe(20);
  });

  test('clear resets both ends', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={[new Date(2026, 8, 22), new Date(2026, 9, 8)]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { hidden: true, name: 'Clear' }));

    expect(onChange.mock.calls[0][0]).toEqual([null, null]);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm vitest run src/base-ui/DatePicker/__tests__/DateRangePicker.test.tsx`
Expected: FAIL, "Cannot find module '../DateRangePicker'".

- [ ] **Step 3: Implement**

`src/base-ui/DatePicker/DateRangePicker.tsx`:

```tsx
'use client';

import dayjs from 'dayjs';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import { memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import datePickerMessages from '@/i18n/resources/en/datePicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { DEFAULT_FORMAT, orderRange } from './calendar';
import CalendarPanel from './CalendarPanel';
import { formatDate } from './DatePicker';
import PickerShell from './PickerShell';
import { styles } from './style';
import type { DateRangePickerProps, DateRangeValue } from './type';

const EMPTY: DateRangeValue = [null, null];

const DateRangePicker = memo<DateRangePickerProps>(
  ({
    allowClear = true,
    className,
    defaultValue = EMPTY,
    disabled,
    disabledDate,
    format,
    max,
    min,
    onChange,
    placeholder,
    shadow,
    size,
    style,
    value,
    variant,
  }) => {
    const { t } = useTranslation(datePickerMessages);
    const [current, setCurrent] = useControlledState<DateRangeValue>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<DateRangeValue>(EMPTY);
    const [hovered, setHovered] = useState<Date | null>(null);
    const [month, setMonth] = useState<Date>(() => current[0] ?? new Date());

    const shown = open && draft[0] ? draft : current;
    const nextMonth = dayjs(month).add(1, 'month').toDate();
    const bounds = { disabledDate, max, min };

    const half = (date: Date | null, fallback: string, active: boolean) => (
      <span className={styles.rangeHalf} data-active={active ? '' : undefined}>
        {date ? (
          formatDate(date, format, DEFAULT_FORMAT.date)
        ) : (
          <span className={styles.placeholder}>{fallback}</span>
        )}
      </span>
    );

    const select = (date: Date) => {
      if (!draft[0] || draft[1]) {
        setDraft([date, null]);
        return;
      }
      const ordered = orderRange(draft[0], date);
      setDraft(EMPTY);
      setCurrent(ordered);
      setOpen(false);
    };

    return (
      <PickerShell
        className={className}
        disabled={disabled}
        icon={
          <span className={styles.icon}>
            <Icon icon={CalendarIcon} size={14} />
          </span>
        }
        open={open}
        shadow={shadow}
        showClear={allowClear && !!(current[0] || current[1])}
        size={size}
        style={style}
        variant={variant}
        trigger={
          <button className={styles.trigger} disabled={disabled} type="button">
            <span className={styles.rangeTrigger}>
              {half(
                shown[0],
                placeholder?.[0] ?? t('datePicker.startPlaceholder'),
                open && !draft[0],
              )}
              <span className={styles.icon}>
                <Icon icon={ArrowRight} size={14} />
              </span>
              {half(
                shown[1],
                placeholder?.[1] ?? t('datePicker.endPlaceholder'),
                open && !!draft[0],
              )}
            </span>
          </button>
        }
        onClear={() => setCurrent(EMPTY)}
        onOpenChange={(next) => {
          if (next) {
            setMonth(current[0] ?? new Date());
            setDraft(EMPTY);
          }
          setOpen(next);
        }}
      >
        <div className={styles.range}>
          <CalendarPanel
            bounds={bounds}
            hovered={hovered}
            mode="date"
            month={month}
            range={draft[0] ? draft : current}
            showNav={false}
            onHover={setHovered}
            onMonthChange={setMonth}
            onSelect={select}
          />
          <CalendarPanel
            bounds={bounds}
            hovered={hovered}
            mode="date"
            month={nextMonth}
            range={draft[0] ? draft : current}
            onHover={setHovered}
            onMonthChange={(next) => setMonth(dayjs(next).subtract(1, 'month').toDate())}
            onSelect={select}
          />
        </div>
      </PickerShell>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
```

Add to `src/base-ui/DatePicker/index.ts`:

```ts
export { default as DateRangePicker } from './DateRangePicker';
```

- [ ] **Step 4: Run the tests**

Run: `pnpm vitest run src/base-ui/DatePicker`
Expected: PASS.

- [ ] **Step 5: Demos and docs**

`src/base-ui/DatePicker/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { Button, DatePicker } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 320 }}>
      <DatePicker
        footer={<Button onClick={() => setExpiresAt(null)}>Never expires</Button>}
        min={new Date()}
        value={expiresAt}
        onChange={setExpiresAt}
      />
      <DatePicker mode="month" variant="filled" />
    </Flexbox>
  );
};
```

`src/base-ui/DatePicker/demos/range.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { DateRangePicker, type DateRangeValue } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [range, setRange] = useState<DateRangeValue>([null, null]);

  return (
    <Flexbox padding={16} style={{ maxWidth: 360 }}>
      <DateRangePicker
        disabledDate={(date) => date > new Date()}
        value={range}
        onChange={setRange}
      />
    </Flexbox>
  );
};
```

`src/base-ui/DatePicker/index.mdx`:

```mdx
---
title: DatePicker
description: Date, month and year picking with native Date values, plus a two-month range picker.
category: Data Entry
---

import DemoIndex from './demos/index.tsx?demo';
import DemoRange from './demos/range.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## Range

<Demo of={DemoRange} layout="bare" />

## APIs

<Api name="DatePicker" from=".." />

<Api name="DateRangePicker" from=".." />

Values are native `Date` objects; days compare by calendar day, so a `min` with a time of day still enables that day. The grid always shows six weeks and follows the active dayjs locale for week start and names. Click the title to move from days to months to years; `mode` sets the lowest level.

### Migrating from antd DatePicker

- `Dayjs` values → `Date` (`dayjs(value).toDate()` at the call site).
- `picker="month"` → `mode="month"`; `minDate` / `maxDate` → `min` / `max`.
- `renderExtraFooter` → `footer`; `showNow={false}` is the default.
- `DatePicker.RangePicker` → `DateRangePicker`.
- Time, week, quarter and `presets` are not supported.
```

- [ ] **Step 6: Lint and commit**

Run: `pnpm exec eslint src/base-ui/DatePicker`
Expected: no errors.

```bash
git add src/base-ui/DatePicker
git commit -m "✨ feat(base-ui): add DateRangePicker, DatePicker docs and demos"
```

---

### Task 6: Colour model and saturation area

**Files:**

- Create: `src/base-ui/ColorPicker/color.ts`
- Create: `src/base-ui/ColorPicker/SaturationArea.tsx`
- Create: `src/base-ui/ColorPicker/style.ts`
- Test: `src/base-ui/ColorPicker/__tests__/color.test.ts`, `src/base-ui/ColorPicker/__tests__/SaturationArea.test.tsx`

**Interfaces:**

- Produces:
  - `interface Hsva { a: number; h: number; s: number; v: number }`
  - `parseColor(value: string | undefined, fallbackHue?: number): Hsva`
  - `formatColor(color: Hsva, alpha: boolean): string` (lowercase hex, 8 digits when `alpha`)
  - `normalizeHexInput(input: string): string | null`
  - `SaturationArea` props `{ hue: number; label: string; saturation: number; value: number; onChange: (saturation: number, value: number) => void; onChangeComplete: () => void }`
  - `styles` from `style.ts` (used by Task 7).

- [ ] **Step 1: Write the failing tests**

`src/base-ui/ColorPicker/__tests__/color.test.ts`:

```ts
import { formatColor, normalizeHexInput, parseColor } from '../color';

describe('colour model', () => {
  test('hex round trips', () => {
    expect(formatColor(parseColor('#0072f5'), false)).toBe('#0072f5');
    expect(formatColor(parseColor('#0072f5cc'), true)).toBe('#0072f5cc');
  });

  test('alpha off drops the alpha channel', () => {
    expect(formatColor(parseColor('#0072f5cc'), false)).toBe('#0072f5');
  });

  test('greys keep the fallback hue', () => {
    expect(parseColor('#808080', 200).h).toBe(200);
    expect(parseColor('#000000', 40).h).toBe(40);
  });

  test('invalid input falls back to black with the fallback hue', () => {
    expect(parseColor('nope', 12)).toEqual({ a: 1, h: 12, s: 0, v: 0 });
  });

  test('normalizeHexInput accepts 3, 6 and 8 digits with or without #', () => {
    expect(normalizeHexInput('0072F5')).toBe('#0072f5');
    expect(normalizeHexInput('#fff')).toBe('#fff');
    expect(normalizeHexInput('0072f5cc')).toBe('#0072f5cc');
    expect(normalizeHexInput('zzz')).toBeNull();
  });
});
```

`src/base-ui/ColorPicker/__tests__/SaturationArea.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import SaturationArea from '../SaturationArea';

describe('SaturationArea', () => {
  afterEach(cleanup);

  test('arrow keys move saturation and brightness by 1%, shift by 10%', () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <SaturationArea
        hue={210}
        label="Colour"
        saturation={0.5}
        value={0.5}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Colour' });

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(0.51, 0.5);

    fireEvent.keyDown(slider, { key: 'ArrowUp', shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(0.5, 0.6);
    expect(onChangeComplete).toHaveBeenCalledTimes(2);
  });

  test('describes both axes', () => {
    render(
      <SaturationArea
        hue={0}
        label="Colour"
        saturation={0.25}
        value={0.75}
        onChange={vi.fn()}
        onChangeComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe(
      'Saturation 25%, brightness 75%',
    );
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `pnpm vitest run src/base-ui/ColorPicker`
Expected: FAIL, modules not found.

- [ ] **Step 3: Colour model**

`src/base-ui/ColorPicker/color.ts`:

```ts
import chroma from 'chroma-js';

export interface Hsva {
  a: number;
  h: number;
  s: number;
  v: number;
}

export const parseColor = (value: string | undefined, fallbackHue = 0): Hsva => {
  if (!value || !chroma.valid(value)) return { a: 1, h: fallbackHue, s: 0, v: 0 };
  const color = chroma(value);
  const [h, s, v] = color.hsv();
  return { a: color.alpha(), h: Number.isNaN(h) ? fallbackHue : h, s, v };
};

export const formatColor = ({ a, h, s, v }: Hsva, alpha: boolean): string =>
  chroma
    .hsv(h, s, v)
    .alpha(alpha ? a : 1)
    .hex(alpha ? 'rgba' : 'rgb');

export const normalizeHexInput = (input: string): string | null => {
  const raw = input.trim().replace(/^#/, '');
  if (!/^([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(raw)) return null;
  return `#${raw.toLowerCase()}`;
};
```

- [ ] **Step 4: Styles**

`src/base-ui/ColorPicker/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

const checker = (color: string) => `
  background-image:
    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%),
    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%);
  background-position: 0 0, 4px 4px;
  background-size: 8px 8px;
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  alphaTrack: css`
    ${checker(cssVar.colorFillSecondary)};
    height: 10px;
    border-radius: 999px;
  `,
  hexRow: css`
    display: flex;
    gap: 6px;
  `,
  hidden: css`
    background: transparent !important;
  `,
  hueTrack: css`
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  `,
  panel: css`
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 240px;
  `,
  preset: css`
    ${focusRing};
    cursor: pointer;

    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    &[aria-pressed='true'] {
      box-shadow:
        0 0 0 2px ${cssVar.colorBgElevated},
        0 0 0 4px ${cssVar.colorText};
    }
  `,
  presets: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-block-start: 14px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  saturation: css`
    ${focusRing};
    touch-action: none;
    cursor: crosshair;

    position: relative;

    height: 164px;
    border-radius: 12px;
  `,
  swatch: css`
    ${checker(cssVar.colorFillSecondary)};
    overflow: hidden;
    display: inline-flex;
    flex: none;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px ${cssVar.colorFillSecondary};

    & > span {
      flex: 1;
    }
  `,
  swatchButton: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    background: none;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
  thumb: css`
    position: absolute;

    box-sizing: border-box;
    width: 18px;
    height: 18px;
    margin: -9px 0 0 -9px;
    border: 3px solid #fff;
    border-radius: 50%;

    box-shadow:
      0 0 0 1px rgb(0 0 0 / 12%),
      0 2px 6px rgb(0 0 0 / 25%);
  `,
  sliderThumb: css`
    width: 18px !important;
    height: 18px !important;
    border: 3px solid #fff !important;
    background: transparent !important;
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 12%),
      0 2px 6px rgb(0 0 0 / 25%) !important;
  `,
  summary: css`
    display: flex;
    gap: 12px;
    align-items: center;
  `,
  value: css`
    font-family: ${cssVar.fontFamilyCode};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  `,
}));
```

`!important` on the slider thumb overrides the base `Slider` thumb styles, which the Slider component applies with the same specificity.

- [ ] **Step 5: SaturationArea**

`src/base-ui/ColorPicker/SaturationArea.tsx`:

```tsx
'use client';

import { memo, type PointerEvent, useRef } from 'react';

import { styles } from './style';

export interface SaturationAreaProps {
  hue: number;
  label: string;
  onChange: (saturation: number, value: number) => void;
  onChangeComplete: () => void;
  saturation: number;
  value: number;
}

const clamp = (n: number) => Math.min(1, Math.max(0, Math.round(n * 100) / 100));

const SaturationArea = memo<SaturationAreaProps>(
  ({ hue, label, onChange, onChangeComplete, saturation, value }) => {
    const areaRef = useRef<HTMLDivElement>(null);

    const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
      const rect = areaRef.current!.getBoundingClientRect();
      onChange(
        clamp((event.clientX - rect.left) / rect.width),
        clamp(1 - (event.clientY - rect.top) / rect.height),
      );
    };

    return (
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(saturation * 100)}
        aria-valuetext={`Saturation ${Math.round(saturation * 100)}%, brightness ${Math.round(value * 100)}%`}
        className={styles.saturation}
        ref={areaRef}
        role="slider"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
        }}
        tabIndex={0}
        onKeyDown={(event) => {
          const delta = event.shiftKey ? 0.1 : 0.01;
          const moves: Record<string, [number, number]> = {
            ArrowDown: [0, -delta],
            ArrowLeft: [-delta, 0],
            ArrowRight: [delta, 0],
            ArrowUp: [0, delta],
          };
          const move = moves[event.key];
          if (!move) return;
          event.preventDefault();
          onChange(clamp(saturation + move[0]), clamp(value + move[1]));
          onChangeComplete();
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          onChangeComplete();
        }}
      >
        <span
          className={styles.thumb}
          style={{ left: `${saturation * 100}%`, top: `${(1 - value) * 100}%` }}
        />
      </div>
    );
  },
);

SaturationArea.displayName = 'ColorPickerSaturationArea';

export default SaturationArea;
```

- [ ] **Step 6: Run the tests**

Run: `pnpm vitest run src/base-ui/ColorPicker`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/ColorPicker
git commit -m "✨ feat(base-ui): add colour model and saturation area"
```

---

### Task 7: ColorPicker component, ColorSwatches switch, docs

**Files:**

- Create: `src/i18n/resources/en/colorPicker.ts`, `src/i18n/resources/zhCn/colorPicker.ts`
- Modify: `src/i18n/resources/en/index.ts`, `src/i18n/resources/zhCn/index.ts`, `src/i18n/types.ts`
- Create: `src/base-ui/ColorPicker/type.ts`, `src/base-ui/ColorPicker/ColorPicker.tsx`, `src/base-ui/ColorPicker/index.ts`, `src/base-ui/ColorPicker/index.mdx`, `src/base-ui/ColorPicker/demos/index.tsx`
- Modify: `src/base-ui/index.ts`
- Modify: `src/ColorSwatches/ColorSwatches.tsx`, `src/ColorSwatches/style.ts`
- Test: `src/base-ui/ColorPicker/__tests__/ColorPicker.test.tsx`

**Interfaces:**

- Consumes: Task 6 (`parseColor`, `formatColor`, `normalizeHexInput`, `SaturationArea`, `styles`); `panelStyles` (Task 4); `Slider` from `@/base-ui/Slider`; `Input`, `InputNumber` from `@/base-ui/Input`; Popover atoms.
- Produces: `ColorPicker` and `ColorPickerProps` from `@lobehub/ui/base-ui`.

- [ ] **Step 1: i18n namespace**

`src/i18n/resources/en/colorPicker.ts`:

```ts
export default {
  'colorPicker.alpha': 'Alpha',
  'colorPicker.eyeDropper': 'Pick from screen',
  'colorPicker.hue': 'Hue',
  'colorPicker.presets': 'Presets',
  'colorPicker.saturation': 'Saturation and brightness',
  'colorPicker.trigger': 'Pick colour',
} as const;
```

`src/i18n/resources/zhCn/colorPicker.ts`:

```ts
export default {
  'colorPicker.alpha': '透明度',
  'colorPicker.eyeDropper': '从屏幕取色',
  'colorPicker.hue': '色相',
  'colorPicker.presets': '预设',
  'colorPicker.saturation': '饱和度与亮度',
  'colorPicker.trigger': '选择颜色',
} as const;
```

Add `export { default as colorPicker } from './colorPicker';` to both `src/i18n/resources/en/index.ts` and `src/i18n/resources/zhCn/index.ts` (alphabetical), and add `typeof import('./resources/en/colorPicker').default &` to `BuiltinTranslationResources` in `src/i18n/types.ts` (alphabetical).

- [ ] **Step 2: Types**

`src/base-ui/ColorPicker/type.ts`:

```ts
import type { CSSProperties, ReactElement } from 'react';

import type { InputSize } from '@/base-ui/Input/type';

export interface ColorPickerProps {
  alpha?: boolean;
  children?: ReactElement;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (hex: string) => void;
  onChangeComplete?: (hex: string) => void;
  presets?: string[];
  showText?: boolean;
  size?: InputSize;
  style?: CSSProperties;
  value?: string;
}
```

- [ ] **Step 3: Write the failing tests**

`src/base-ui/ColorPicker/__tests__/ColorPicker.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import ColorPicker from '../ColorPicker';

const openPicker = () => fireEvent.click(screen.getByRole('button', { name: 'Pick colour' }));

describe('ColorPicker', () => {
  afterEach(cleanup);

  test('shows the hex headline for the current value', () => {
    render(<ColorPicker defaultValue="#0072f5" />);

    openPicker();

    expect(screen.getByText('#0072F5')).toBeTruthy();
  });

  test('presets emit onChange and onChangeComplete', () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <ColorPicker
        defaultValue="#0072f5"
        presets={['#f4416c']}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '#f4416c' }));

    expect(onChange).toHaveBeenLastCalledWith('#f4416c', expect.anything());
    expect(onChangeComplete).toHaveBeenLastCalledWith('#f4416c');
  });

  test('keyboard on the saturation area emits while moving and completes', () => {
    const onChange = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <ColorPicker
        defaultValue="#808080"
        onChange={onChange}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Saturation and brightness' }), {
      key: 'ArrowRight',
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChangeComplete).toHaveBeenCalledTimes(1);
  });

  test('alpha mode emits 8-digit hex', () => {
    const onChangeComplete = vi.fn();
    render(
      <ColorPicker
        alpha
        defaultValue="#0072f5"
        presets={['#f4416c']}
        onChangeComplete={onChangeComplete}
      />,
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '#f4416c' }));

    expect(onChangeComplete).toHaveBeenLastCalledWith('#f4416cff');
  });

  test('hex input commits on Enter and ignores invalid text', () => {
    const onChangeComplete = vi.fn();
    render(<ColorPicker defaultValue="#0072f5" onChangeComplete={onChangeComplete} />);

    openPicker();
    const input = screen.getByLabelText('HEX');
    fireEvent.change(input, { target: { value: 'zzz' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChangeComplete).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '379D4A' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChangeComplete).toHaveBeenLastCalledWith('#379d4a');
  });
});
```

- [ ] **Step 4: Run to see it fail**

Run: `pnpm vitest run src/base-ui/ColorPicker/__tests__/ColorPicker.test.tsx`
Expected: FAIL, "Cannot find module '../ColorPicker'".

- [ ] **Step 5: Implement**

`src/base-ui/ColorPicker/ColorPicker.tsx`:

```tsx
'use client';

import { cx, useThemeMode } from 'antd-style';
import { Pipette } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import useControlledState from 'use-merge-value';

import { Input, InputNumber } from '@/base-ui/Input';
import { rootVariants } from '@/base-ui/Input/style';
import { panelStyles } from '@/base-ui/panelStyles';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/base-ui/Popover';
import { Slider } from '@/base-ui/Slider';
import colorPickerMessages from '@/i18n/resources/en/colorPicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { formatColor, type Hsva, normalizeHexInput, parseColor } from './color';
import SaturationArea from './SaturationArea';
import { styles } from './style';
import type { ColorPickerProps } from './type';

const DEFAULT_COLOR = '#000000';

const hasEyeDropper = () => typeof window !== 'undefined' && 'EyeDropper' in window;

const ColorPicker = memo<ColorPickerProps>(
  ({
    alpha = false,
    children,
    className,
    defaultValue = DEFAULT_COLOR,
    disabled,
    onChange,
    onChangeComplete,
    presets,
    showText,
    size = 'middle',
    style,
    value,
  }) => {
    const { t } = useTranslation(colorPickerMessages);
    const { isDarkMode } = useThemeMode();
    const [hex, setHex] = useControlledState<string>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });
    const [hsva, setHsva] = useState<Hsva>(() => parseColor(hex));
    const [draft, setDraft] = useState(hex.slice(1).toUpperCase());

    useEffect(() => {
      setHsva((current) =>
        formatColor(current, alpha) === hex ? current : parseColor(hex, current.h),
      );
      setDraft(hex.slice(1).toUpperCase());
    }, [hex, alpha]);

    const update = (next: Hsva) => {
      setHsva(next);
      setHex(formatColor(next, alpha));
    };
    const commit = (next: Hsva) => onChangeComplete?.(formatColor(next, alpha));
    const apply = (next: Hsva) => {
      update(next);
      commit(next);
    };

    const commitDraft = () => {
      const normalized = normalizeHexInput(draft);
      if (!normalized) return setDraft(hex.slice(1).toUpperCase());
      apply(parseColor(normalized, hsva.h));
    };

    const swatch = (dimension: number) => (
      <span className={styles.swatch} style={{ height: dimension, width: dimension }}>
        <span style={{ background: hex }} />
      </span>
    );

    const trigger =
      children ??
      (showText ? (
        <button
          aria-label={t('colorPicker.trigger')}
          className={cx(
            rootVariants({ size, variant: isDarkMode ? 'filled' : 'outlined' }),
            className,
          )}
          disabled={disabled}
          style={style}
          type="button"
        >
          {swatch(18)}
          <span style={{ fontFamily: 'var(--lobe-font-family-code, monospace)' }}>
            {hex.toUpperCase()}
          </span>
        </button>
      ) : (
        <button
          aria-label={t('colorPicker.trigger')}
          className={cx(styles.swatchButton, className)}
          disabled={disabled}
          style={style}
          type="button"
        >
          {swatch(24)}
        </button>
      ));

    return (
      <PopoverRoot>
        <PopoverTriggerElement>{trigger}</PopoverTriggerElement>
        <PopoverPortal>
          <PopoverPositioner placement="bottomLeft">
            <PopoverPopup className={panelStyles.popup}>
              <div className={styles.panel}>
                <div className={styles.summary}>
                  {swatch(40)}
                  <div>
                    <div className={styles.value}>{hex.toUpperCase()}</div>
                    <div className={panelStyles.label}>
                      {alpha ? `HEX · ${Math.round(hsva.a * 100)}%` : 'HEX'}
                    </div>
                  </div>
                  {hasEyeDropper() && (
                    <button
                      aria-label={t('colorPicker.eyeDropper')}
                      className={panelStyles.nav}
                      style={{ marginInlineStart: 'auto' }}
                      type="button"
                      onClick={async () => {
                        const dropper = new (
                          window as unknown as {
                            EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
                          }
                        ).EyeDropper();
                        const result = await dropper.open().catch(() => null);
                        if (result) apply({ ...parseColor(result.sRGBHex, hsva.h), a: hsva.a });
                      }}
                    >
                      <Icon icon={Pipette} size={14} />
                    </button>
                  )}
                </div>
                <SaturationArea
                  hue={hsva.h}
                  label={t('colorPicker.saturation')}
                  saturation={hsva.s}
                  value={hsva.v}
                  onChange={(s, v) => update({ ...hsva, s, v })}
                  onChangeComplete={() => commit(hsva)}
                />
                <Slider
                  aria-label={t('colorPicker.hue')}
                  classNames={{
                    indicator: styles.hidden,
                    thumb: styles.sliderThumb,
                    track: styles.hueTrack,
                  }}
                  max={360}
                  min={0}
                  value={hsva.h}
                  onChange={(h) => update({ ...hsva, h })}
                  onChangeComplete={(h) => commit({ ...hsva, h })}
                />
                {alpha && (
                  <Slider
                    aria-label={t('colorPicker.alpha')}
                    classNames={{
                      indicator: styles.hidden,
                      thumb: styles.sliderThumb,
                      track: styles.alphaTrack,
                    }}
                    max={100}
                    min={0}
                    styles={{
                      track: {
                        backgroundImage: `linear-gradient(to right, transparent, ${formatColor(hsva, false)})`,
                      },
                    }}
                    value={Math.round(hsva.a * 100)}
                    onChange={(a) => update({ ...hsva, a: a / 100 })}
                    onChangeComplete={(a) => commit({ ...hsva, a: a / 100 })}
                  />
                )}
                <div className={styles.hexRow}>
                  <Input
                    aria-label="HEX"
                    prefix={<span className={panelStyles.label}>HEX</span>}
                    value={draft}
                    variant="filled"
                    onBlur={commitDraft}
                    onChange={(event) => setDraft(event.target.value)}
                    onPressEnter={commitDraft}
                  />
                  {alpha && (
                    <InputNumber
                      aria-label={t('colorPicker.alpha')}
                      controls={false}
                      max={100}
                      min={0}
                      style={{ width: 76 }}
                      suffix="%"
                      value={Math.round(hsva.a * 100)}
                      variant="filled"
                      onChange={(a) => a !== null && apply({ ...hsva, a: a / 100 })}
                    />
                  )}
                </div>
                {presets && presets.length > 0 && (
                  <div
                    aria-label={t('colorPicker.presets')}
                    className={styles.presets}
                    role="group"
                  >
                    {presets.map((color) => (
                      <button
                        aria-label={color}
                        aria-pressed={color.toLowerCase() === hex.slice(0, 7).toLowerCase()}
                        className={styles.preset}
                        key={color}
                        style={{ background: color }}
                        type="button"
                        onClick={() =>
                          apply({ ...parseColor(color, hsva.h), a: parseColor(color).a })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </PopoverRoot>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
```

The `commit(hsva)` in `SaturationArea.onChangeComplete` reads the state from the latest render, which already contains the last pointer / key update because each update is its own event.

`src/base-ui/ColorPicker/index.ts`:

```ts
export { default as ColorPicker } from './ColorPicker';
export type { ColorPickerProps } from './type';
```

In `src/base-ui/index.ts` add `export * from './ColorPicker';` (alphabetical, before `ContextMenu`).

- [ ] **Step 6: Run the tests**

Run: `pnpm vitest run src/base-ui/ColorPicker`
Expected: PASS. If `screen.getByLabelText('HEX')` finds two elements (the prefix label and the input), switch the test to `screen.getByRole('textbox', { name: 'HEX' })`.

- [ ] **Step 7: Switch ColorSwatches to it**

In `src/ColorSwatches/ColorSwatches.tsx`:

1. Replace `import { ColorPicker } from 'antd';` with `import { ColorPicker } from '@/base-ui/ColorPicker';`.
2. Replace the whole `{enableColorPicker && ( <Tooltip …> <ColorPicker …/> </Tooltip> )}` block with:

```tsx
{
  enableColorPicker && (
    <Tooltip title={texts?.custom || 'Custom'}>
      <span style={{ display: 'inline-flex' }}>
        <ColorPicker
          presets={enableColorSwatches ? undefined : colors.map((c) => c.color)}
          value={isCustomActive ? active : undefined}
          onChangeComplete={setActive}
        >
          <button
            aria-label={texts?.custom || 'Custom'}
            type="button"
            className={cx(
              styles.picker,
              enableColorSwatches && styles.conic,
              isCustomActive && styles.active,
            )}
            style={{
              background: enableColorSwatches ? undefined : active,
              borderRadius: shape === 'circle' ? '50%' : cssVar.borderRadius,
            }}
          />
        </ColorPicker>
      </span>
    </Tooltip>
  );
}
```

3. In `src/ColorSwatches/style.ts` delete `const prefixCls = 'ant';` and both `.${prefixCls}-color-picker-color-block { … }` blocks; add `cursor: pointer;` as the first line of `picker`.

Run: `pnpm vitest run src/ColorSwatches`
Expected: PASS (or "No test files found", which is fine).

- [ ] **Step 8: Demo and docs**

`src/base-ui/ColorPicker/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { ColorPicker } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const presets = [
  '#f4416c',
  '#f88c13',
  '#ee9e0b',
  '#379d4a',
  '#2ec5b6',
  '#0072f5',
  '#bd54c6',
  '#080808',
];

export default () => {
  const [color, setColor] = useState('#0072f5');

  return (
    <Flexbox horizontal align="center" gap={24} padding={16}>
      <ColorPicker presets={presets} value={color} onChange={setColor} />
      <ColorPicker showText value={color} onChange={setColor} />
      <ColorPicker alpha showText defaultValue="#0072f5cc" />
    </Flexbox>
  );
};
```

`src/base-ui/ColorPicker/index.mdx`:

```mdx
---
title: ColorPicker
description: Hex colour picking with a saturation area, hue and alpha sliders, presets and the EyeDropper API.
category: Data Entry
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="ColorPicker" from=".." />

Values are lowercase hex strings; with `alpha` they are always 8 digits. `onChange` fires while dragging, `onChangeComplete` when the pointer is released or an input commits, so write to a store in `onChangeComplete`. Pass a single element as `children` to use your own trigger.

### Migrating from antd ColorPicker

- `Color` objects → hex strings; `onChangeComplete={(c) => c.toHexString()}` → `onChangeComplete={(hex) => …}`.
- `disabledAlpha` is the default; set `alpha` to enable it.
- `presets={[{ label, colors }]}` → `presets={colors}`.
- RGB / HSL inputs, gradients and `format` are not supported.
```

- [ ] **Step 9: Lint and commit**

Run: `pnpm exec eslint src/base-ui/ColorPicker src/ColorSwatches src/base-ui/index.ts src/i18n`
Expected: no errors.

```bash
git add src/base-ui/ColorPicker src/ColorSwatches src/base-ui/index.ts src/i18n
git commit -m "✨ feat(base-ui): add ColorPicker and move ColorSwatches off antd"
```

---

### Task 8: QRCode

**Files:**

- Modify: `package.json` (add `uqr`)
- Create: `src/i18n/resources/en/qrCode.ts`, `src/i18n/resources/zhCn/qrCode.ts`
- Modify: `src/i18n/resources/en/index.ts`, `src/i18n/resources/zhCn/index.ts`, `src/i18n/types.ts`
- Create: `src/base-ui/QRCode/qrPath.ts`, `src/base-ui/QRCode/QRCode.tsx`, `src/base-ui/QRCode/type.ts`, `src/base-ui/QRCode/style.ts`, `src/base-ui/QRCode/index.ts`, `src/base-ui/QRCode/index.mdx`, `src/base-ui/QRCode/demos/index.tsx`
- Modify: `src/base-ui/index.ts`
- Test: `src/base-ui/QRCode/__tests__/QRCode.test.tsx`

**Interfaces:**

- Consumes: `panelStyles.pill` (Task 4); `Spin` from `@/base-ui/Spin`.
- Produces: `QRCode`, `QRCodeProps` from `@lobehub/ui/base-ui`; `buildQrPath(matrix: boolean[][], hole: number): string`.

- [ ] **Step 1: Add the dependency and read its types**

Run: `pnpm add uqr`
Run: `sed -n '1,80p' node_modules/uqr/dist/index.d.mts`
Expected: an `encode(data, options)` export whose options include `ecc?: 'L' | 'M' | 'Q' | 'H'` and `border?: number`, returning `{ data: boolean[][]; size: number; … }`. If the names differ, adapt Step 4 to the actual names.

- [ ] **Step 2: i18n namespace**

`src/i18n/resources/en/qrCode.ts`:

```ts
export default {
  'qrCode.expired': 'Expired',
  'qrCode.loading': 'Loading',
  'qrCode.refresh': 'Refresh',
} as const;
```

`src/i18n/resources/zhCn/qrCode.ts`:

```ts
export default {
  'qrCode.expired': '已过期',
  'qrCode.loading': '加载中',
  'qrCode.refresh': '刷新',
} as const;
```

Add `export { default as qrCode } from './qrCode';` to both `src/i18n/resources/en/index.ts` and `src/i18n/resources/zhCn/index.ts` (alphabetical), and add `typeof import('./resources/en/qrCode').default &` to `BuiltinTranslationResources` in `src/i18n/types.ts` (alphabetical).

- [ ] **Step 3: Write the failing tests**

`src/base-ui/QRCode/__tests__/QRCode.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { buildQrPath } from '../qrPath';
import QRCode from '../QRCode';

describe('buildQrPath', () => {
  test('one square per dark module, skipping the centre hole', () => {
    const matrix = [
      [true, false, true],
      [false, true, false],
      [true, false, true],
    ];
    expect(buildQrPath(matrix, 0)).toBe(
      'M0 0h1v1h-1zM2 0h1v1h-1zM1 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1z',
    );
    expect(buildQrPath(matrix, 1)).toBe('M0 0h1v1h-1zM2 0h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1z');
  });
});

describe('QRCode', () => {
  afterEach(cleanup);

  test('renders an svg path labelled with the value', () => {
    const { container } = render(<QRCode value="https://lobehub.com" />);

    expect(screen.getByRole('img', { name: 'https://lobehub.com' })).toBeTruthy();
    expect(container.querySelector('svg path')?.getAttribute('d')?.length).toBeGreaterThan(100);
  });

  test('defaults to dark modules on white', () => {
    const { container } = render(<QRCode value="x" />);

    expect(container.querySelector('svg path')?.getAttribute('fill')).toBe('#000');
    expect(container.querySelector('svg rect')?.getAttribute('fill')).toBe('#fff');
  });

  test('expired shows Refresh only with onRefresh', () => {
    const onRefresh = vi.fn();
    const { rerender } = render(<QRCode status="expired" value="x" />);
    expect(screen.getByText('Expired')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Refresh' })).toBeNull();

    rerender(<QRCode status="expired" value="x" onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  test('icon clears a hole in the modules', () => {
    const { container, rerender } = render(<QRCode value="https://lobehub.com" />);
    const full = container.querySelector('svg path')!.getAttribute('d')!.length;

    rerender(<QRCode icon={<span>L</span>} value="https://lobehub.com" />);
    const holed = container.querySelector('svg path')!.getAttribute('d')!.length;

    expect(screen.getByText('L')).toBeTruthy();
    expect(holed).toBeLessThan(full * 1.5);
  });
});
```

The icon test only checks the icon renders and the path stays bounded, because error level H makes the matrix larger while the hole removes modules.

- [ ] **Step 4: Run to see it fail, then implement**

Run: `pnpm vitest run src/base-ui/QRCode`
Expected: FAIL, modules not found.

`src/base-ui/QRCode/qrPath.ts`:

```ts
export const buildQrPath = (matrix: boolean[][], hole: number): string => {
  const count = matrix.length;
  const from = Math.floor((count - hole) / 2);
  const to = from + hole;
  let path = '';
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (hole > 0 && x >= from && x < to && y >= from && y < to) continue;
      if (matrix[y][x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return path;
};
```

`src/base-ui/QRCode/type.ts`:

```ts
import type { ComponentProps, ReactNode, Ref } from 'react';

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H';
export type QRCodeStatus = 'active' | 'loading' | 'expired';

export interface QRCodeProps extends Omit<ComponentProps<'div'>, 'children'> {
  bgColor?: string;
  bordered?: boolean;
  color?: string;
  errorLevel?: QRCodeErrorLevel;
  icon?: ReactNode;
  onRefresh?: () => void;
  ref?: Ref<HTMLDivElement>;
  size?: number;
  status?: QRCodeStatus;
  value: string;
}
```

`src/base-ui/QRCode/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bordered: css`
    box-shadow: inset 0 0 0 1px ${cssVar.colorBorderSecondary};
  `,
  icon: css`
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);

    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    box-shadow: 0 0 0 4px #fff;
  `,
  overlay: css`
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;

    border-radius: 16px;

    color: #080808;

    background: rgb(255 255 255 / 95%);
  `,
  overlayTitle: css`
    font-size: 17px;
    font-weight: 600;
  `,
  root: css`
    position: relative;
    display: inline-flex;
    padding: 16px;
    border-radius: 16px;
  `,
}));
```

The overlay uses fixed near-white and near-black because the code itself is always dark-on-white; theme tokens would invert in dark mode.

`src/base-ui/QRCode/QRCode.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { RotateCw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { encode } from 'uqr';

import { panelStyles } from '@/base-ui/panelStyles';
import Spin from '@/base-ui/Spin';
import qrCodeMessages from '@/i18n/resources/en/qrCode';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { buildQrPath } from './qrPath';
import { styles } from './style';
import type { QRCodeProps } from './type';

const ICON_RATIO = 0.22;

const QRCode = memo<QRCodeProps>(
  ({
    bgColor = '#fff',
    bordered = true,
    className,
    color = '#000',
    errorLevel = 'M',
    icon,
    onRefresh,
    ref,
    size = 160,
    status = 'active',
    style,
    value,
    ...rest
  }) => {
    const { t } = useTranslation(qrCodeMessages);
    const { count, path } = useMemo(() => {
      const { data } = encode(value, { border: 0, ecc: icon ? 'H' : errorLevel });
      const hole = icon ? Math.ceil(data.length * ICON_RATIO) | 1 : 0;
      return { count: data.length, path: buildQrPath(data, hole) };
    }, [value, icon, errorLevel]);

    return (
      <div
        aria-label={value}
        className={cx(styles.root, bordered && styles.bordered, className)}
        ref={ref}
        role="img"
        style={{ background: bgColor, ...style }}
        {...rest}
      >
        <svg
          height={size}
          shapeRendering="crispEdges"
          viewBox={`0 0 ${count} ${count}`}
          width={size}
        >
          <rect fill={bgColor} height={count} width={count} />
          <path d={path} fill={color} />
        </svg>
        {icon && (
          <span
            className={styles.icon}
            style={{ height: size * ICON_RATIO, width: size * ICON_RATIO }}
          >
            {icon}
          </span>
        )}
        {status === 'loading' && (
          <span aria-label={t('qrCode.loading')} className={styles.overlay} role="status">
            <Spin />
          </span>
        )}
        {status === 'expired' && (
          <span className={styles.overlay}>
            <span className={styles.overlayTitle}>{t('qrCode.expired')}</span>
            {onRefresh && (
              <button
                className={panelStyles.pill}
                style={{ background: '#080808', color: '#fff' }}
                type="button"
                onClick={onRefresh}
              >
                <Icon icon={RotateCw} size={14} />
                {t('qrCode.refresh')}
              </button>
            )}
          </span>
        )}
      </div>
    );
  },
);

QRCode.displayName = 'QRCode';

export default QRCode;
```

`| 1` keeps the hole an odd number of modules so it centres exactly.

`src/base-ui/QRCode/index.ts`:

```ts
export { default } from './QRCode';
export type { QRCodeErrorLevel, QRCodeProps, QRCodeStatus } from './type';
```

In `src/base-ui/index.ts` add, alphabetically:

```ts
export { default as QRCode } from './QRCode';
export * from './QRCode';
```

- [ ] **Step 5: Run the tests**

Run: `pnpm vitest run src/base-ui/QRCode`
Expected: PASS.

- [ ] **Step 6: Demo and docs**

`src/base-ui/QRCode/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { QRCode } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [expired, setExpired] = useState(true);

  return (
    <Flexbox horizontal gap={24} padding={16} wrap="wrap">
      <QRCode value="https://lobehub.com" />
      <QRCode
        icon={<img alt="" height="100%" src="https://lobehub.com/favicon.ico" width="100%" />}
        value="https://lobehub.com"
      />
      <QRCode status="loading" value="https://lobehub.com" />
      <QRCode
        status={expired ? 'expired' : 'active'}
        value="https://lobehub.com"
        onRefresh={() => setExpired(false)}
      />
    </Flexbox>
  );
};
```

`src/base-ui/QRCode/index.mdx`:

```mdx
---
title: QRCode
description: SVG QR code, dark on white in both themes, with an optional centre icon and loading / expired states.
category: Data Display
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="QRCode" from=".." />

The code stays dark on white in dark mode so phones can scan it; `color` and `bgColor` override that. Setting `icon` raises the error correction level to `H` and clears the modules under the icon. `status="expired"` shows a Refresh button when `onRefresh` is set.

### Migrating from antd QRCode

- Drop `color="#000"`, `bgColor="#fff"` and `bordered={false}` where they only restated the old workaround; keep `bordered={false}` if you want no outline.
- `type="canvas"` is not supported; output is always SVG.
```

- [ ] **Step 7: Lint and commit**

Run: `pnpm exec eslint src/base-ui/QRCode src/base-ui/index.ts src/i18n`
Expected: no errors.

```bash
git add package.json pnpm-lock.yaml src/base-ui/QRCode src/base-ui/index.ts src/i18n
git commit -m "✨ feat(base-ui): add QRCode on uqr"
```

---

### Task 9: Burger

**Files:**

- Create: `src/i18n/resources/en/burger.ts`, `src/i18n/resources/zhCn/burger.ts`
- Modify: `src/i18n/resources/en/index.ts`, `src/i18n/resources/zhCn/index.ts`, `src/i18n/types.ts`
- Create: `src/base-ui/Burger/Burger.tsx`, `src/base-ui/Burger/type.ts`, `src/base-ui/Burger/style.ts`, `src/base-ui/Burger/index.ts`, `src/base-ui/Burger/index.mdx`, `src/base-ui/Burger/demos/index.tsx`
- Modify: `src/base-ui/index.ts`
- Test: `src/base-ui/Burger/__tests__/Burger.test.tsx`

**Interfaces:**

- Consumes: `List`, `ListItem` from `@/base-ui/List`; `Drawer` from `@/base-ui/Drawer`; `ActionIcon` from `@/base-ui/ActionIcon`.
- Produces: `Burger`, `BurgerProps` from `@lobehub/ui/base-ui`.

- [ ] **Step 1: i18n namespace**

`src/i18n/resources/en/burger.ts`:

```ts
export default {
  'burger.close': 'Close menu',
  'burger.open': 'Open menu',
} as const;
```

`src/i18n/resources/zhCn/burger.ts`:

```ts
export default {
  'burger.close': '关闭菜单',
  'burger.open': '打开菜单',
} as const;
```

Add `export { default as burger } from './burger';` to both `src/i18n/resources/en/index.ts` and `src/i18n/resources/zhCn/index.ts` (alphabetical), and add `typeof import('./resources/en/burger').default &` to `BuiltinTranslationResources` in `src/i18n/types.ts` (alphabetical).

- [ ] **Step 2: Write the failing tests**

`src/base-ui/Burger/__tests__/Burger.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import type { ListItem } from '@/base-ui/List';

import Burger from '../Burger';

const items: ListItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'chat', label: 'Chat' },
  { type: 'divider' },
  { key: 'docs', label: 'Docs' },
];

describe('Burger', () => {
  afterEach(cleanup);

  test('toggle asks to open', () => {
    const onOpenChange = vi.fn();
    render(<Burger items={items} opened={false} onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  test('marks the active item and selecting closes', () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <Burger
        opened
        activeKey="chat"
        items={items}
        onOpenChange={onOpenChange}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole('button', { name: 'Chat' }).getAttribute('aria-current')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Docs' }));

    expect(onSelect).toHaveBeenCalledWith('docs');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('Escape closes', () => {
    const onOpenChange = vi.fn();
    render(<Burger opened items={items} onOpenChange={onOpenChange} />);

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('fullscreen drops dividers and renders the footer', () => {
    render(
      <Burger
        fullscreen
        opened
        footer={<button type="button">Sign in</button>}
        items={items}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Close menu' }).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run to see it fail**

Run: `pnpm vitest run src/base-ui/Burger`
Expected: FAIL, "Cannot find module '../Burger'".

- [ ] **Step 4: Implement**

`src/base-ui/Burger/type.ts`:

```ts
import type { CSSProperties, Key, ReactNode } from 'react';

import type { ActionIconProps } from '@/base-ui/ActionIcon';
import type { ListItem } from '@/base-ui/List';

export interface BurgerProps {
  activeKey?: Key | null;
  className?: string;
  footer?: ReactNode;
  fullscreen?: boolean;
  headerHeight?: number;
  items: ListItem[];
  onOpenChange: (opened: boolean) => void;
  onSelect?: (key: Key) => void;
  opened: boolean;
  size?: ActionIconProps['size'];
  style?: CSSProperties;
  variant?: ActionIconProps['variant'];
}
```

Check `ListItem` is exported from `src/base-ui/List/index.ts` (it is, via `export type { … } from './type'`); if not, add it there.

`src/base-ui/Burger/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
  `,
  footer: css`
    display: flex;
    gap: 8px;
    margin-block-start: auto;
    padding: 20px;
  `,
  fullHeader: css`
    display: flex;
    flex: none;
    align-items: center;
    justify-content: flex-end;
    padding-inline: 12px;
  `,
  largeRow: css`
    min-height: 48px;
    padding-inline: 8px;
    border-radius: 12px;

    font-size: 32px;
    font-weight: 600;
    line-height: 1.15;
    color: ${cssVar.colorTextQuaternary};
    letter-spacing: -0.02em;

    background: none;

    &[aria-current='true'],
    &[aria-current='true']:hover {
      color: ${cssVar.colorText};
      background: none;
    }
  `,
  row: css`
    gap: 14px;

    min-height: 52px;
    padding-inline: 16px;
    border-radius: 999px;

    font-size: 17px;

    &[aria-current='true'],
    &[aria-current='true']:hover {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }
  `,
}));
```

`src/base-ui/Burger/Burger.tsx`:

```tsx
'use client';

import { Menu, X } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/base-ui/ActionIcon';
import { Drawer } from '@/base-ui/Drawer';
import List, { type ListItem } from '@/base-ui/List';
import burgerMessages from '@/i18n/resources/en/burger';
import { useTranslation } from '@/i18n/useTranslation';

import { styles } from './style';
import type { BurgerProps } from './type';

const withoutIcons = (items: ListItem[]): ListItem[] =>
  items.flatMap((item) => (item.type === 'divider' ? [] : [{ ...item, icon: undefined }]));

const Burger = memo<BurgerProps>(
  ({
    activeKey,
    className,
    footer,
    fullscreen = false,
    headerHeight = 64,
    items,
    onOpenChange,
    onSelect,
    opened,
    size,
    style,
    variant,
  }) => {
    const { t } = useTranslation(burgerMessages);
    const close = () => onOpenChange(false);

    const toggle = (
      <ActionIcon
        aria-expanded={opened}
        aria-label={opened ? t('burger.close') : t('burger.open')}
        className={className}
        icon={opened ? X : Menu}
        size={size}
        style={style}
        variant={variant}
        onClick={() => onOpenChange(!opened)}
      />
    );

    return (
      <>
        {toggle}
        <Drawer
          noHeader
          classNames={{ bodyContent: styles.body }}
          height={fullscreen ? '100dvh' : `calc(100dvh - ${headerHeight}px)`}
          open={opened}
          placement="top"
          styles={fullscreen ? undefined : { popup: { insetBlockStart: headerHeight } }}
          onClose={close}
        >
          {fullscreen && (
            <div className={styles.fullHeader} style={{ height: headerHeight }}>
              <ActionIcon aria-label={t('burger.close')} icon={X} size={size} onClick={close} />
            </div>
          )}
          <List
            selectable
            activeKey={activeKey ?? null}
            classNames={{ item: fullscreen ? styles.largeRow : styles.row }}
            items={fullscreen ? withoutIcons(items) : items}
            onClick={({ key }) => {
              onSelect?.(key);
              close();
            }}
          />
          {fullscreen && footer && <div className={styles.footer}>{footer}</div>}
        </Drawer>
      </>
    );
  },
);

Burger.displayName = 'Burger';

export default Burger;
```

If `ActionIcon` does not forward `aria-label` / `aria-expanded` to its button, pass the label through its `title` prop instead and keep `aria-expanded` via the same prop spread it supports; check `src/base-ui/ActionIcon/type.ts` for the accepted props.

`src/base-ui/Burger/index.ts`:

```ts
export { default } from './Burger';
export type { BurgerProps } from './type';
```

In `src/base-ui/index.ts` add, alphabetically (after `Breadcrumb`):

```ts
export { default as Burger } from './Burger';
export * from './Burger';
```

- [ ] **Step 5: Run the tests**

Run: `pnpm vitest run src/base-ui/Burger`
Expected: PASS.

- [ ] **Step 6: Demo and docs**

`src/base-ui/Burger/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { Burger, Button, type ListItem } from '@lobehub/ui/base-ui';
import { BookOpen, Bot, House, MessageSquare } from 'lucide-react';
import { type Key, useState } from 'react';

const items: ListItem[] = [
  { icon: House, key: 'home', label: 'Home' },
  { icon: MessageSquare, key: 'chat', label: 'Chat' },
  { icon: Bot, key: 'agents', label: 'Agents' },
  { type: 'divider' },
  { icon: BookOpen, key: 'docs', label: 'Docs' },
];

export default () => {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<Key>('chat');

  return (
    <Flexbox horizontal align="center" justify="space-between" padding={16} style={{ height: 64 }}>
      <strong>LobeHub</strong>
      <Burger
        activeKey={active}
        footer={<Button type="primary">Sign in</Button>}
        items={items}
        opened={opened}
        onOpenChange={setOpened}
        onSelect={setActive}
      />
    </Flexbox>
  );
};
```

`src/base-ui/Burger/index.mdx`:

```mdx
---
title: Burger
description: Mobile navigation toggle that opens a drawer of List items under the header, or fullscreen with large type.
category: Navigation
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="Burger" from=".." />

`items` use the base-ui `List` item shape, so the same builders serve desktop lists and the mobile menu. Selecting an item calls `onSelect` and closes the drawer. `fullscreen` covers the header, renders labels in large type without icons and pins `footer` to the bottom.

### Migrating from the root Burger

- `setOpened` → `onOpenChange`; `selectedKeys` → `activeKey`; `onClick` → `onSelect(key)`.
- antd `Menu` items → base-ui `List` items; nested submenus are not supported.
- `drawerProps`, `openKeys`, `rootClassName` and `iconProps` are gone.
```

- [ ] **Step 7: Lint and commit**

Run: `pnpm exec eslint src/base-ui/Burger src/base-ui/index.ts src/i18n`
Expected: no errors.

```bash
git add src/base-ui/Burger src/base-ui/index.ts src/i18n
git commit -m "✨ feat(base-ui): add Burger"
```

---

### Task 10: Whole-branch verification

**Files:**

- Modify: only what the checks below reveal.

- [ ] **Step 1: No antd or rc imports in new code**

Run: `rg -n "from '(antd|@ant-design/[^']+|@rc-component/[^']+|rc-[^']+)'" src/base-ui src/ColorSwatches src/Menu/itemInterface.ts`
Expected: no output.

- [ ] **Step 2: Every new component is exported**

Run: `rg -n "DatePicker|DateRangePicker|ColorPicker|QRCode|Burger" src/base-ui/index.ts`
Expected: lines for `./DatePicker`, `./ColorPicker`, `./QRCode`, `./Burger`.

- [ ] **Step 3: Tests for everything touched**

Run: `pnpm vitest run src/base-ui src/ColorSwatches src/Menu src/i18n`
Expected: PASS.

- [ ] **Step 4: Types for everything touched**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | rg "src/(base-ui|ColorSwatches|Menu|i18n)"`
Expected: no output.

- [ ] **Step 5: Browser check**

Invoke the `local-testing` skill and open, against `pnpm dev`: `/components/base-ui/date-picker`, `/components/base-ui/color-picker`, `/components/base-ui/qr-code`, `/components/base-ui/burger`, `/components/base-ui/input`. For each: open every popup, check light and dark themes, check the style B rules from Global Constraints (16px popup radius, 22px title, round cells, black selection), and compare against the canvas boards at https://claude.ai/artifact/MWpkxhiCyC8FQD9r13L59K (page "New components"). Route names may differ; find them in the docs sidebar.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A src
git commit -m "🐛 fix(base-ui): verification fixes for remaining components"
```

Skip the commit if nothing changed.
