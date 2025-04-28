'use client';

import type { InputRef } from 'antd';
import { cva } from 'class-variance-authority';
import { isEqual } from 'lodash-es';
import { Undo2Icon } from 'lucide-react';
import {
  type FocusEvent,
  type MouseEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHotkeys, useRecordHotkeys } from 'react-hotkeys-hook';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import Hotkey from '@/Hotkey';
import { checkIsAppleDevice, splitKeysByPlus } from '@/Hotkey/utils';

import { useStyles } from './style';
import type { HotkeyInputProps } from './type';

// 修饰键列表
const MODIFIER_KEYS = new Set(['alt', 'mod', 'shift', 'meta', 'ctrl', 'control']);

const HotkeyInput = memo<HotkeyInputProps>(
  ({
    value = '',
    defaultValue = '',
    resetValue = '',
    onChange,
    onConflict,
    placeholder = 'Press keys to record shortcut',
    disabled,
    shadow,
    allowReset = true,
    style,
    className,
    hotkeyConflicts = [],
    variant,
    texts,
    isApple,
    onBlur,
    onReset,
    onFocus,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasConflict, setHasConflict] = useState(false);
    const [hasInvalidCombination, setHasInvalidCombination] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const { cx, styles, theme } = useStyles();
    const isAppleDevice = useMemo(() => checkIsAppleDevice(isApple), [isApple]);
    const [hotkeyValue, setHotkeyValue] = useControlledState(defaultValue, {
      defaultValue,
      onChange,
      value,
    });

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            disabled: false,
            error: false,
            shadow: false,
            variant: 'outlined',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
            focused: {
              false: null,
              true: styles.focused,
            },
            error: {
              fales: null,
              true: styles.error,
            },
            disabled: {
              false: null,
              true: styles.disabled,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    // 使用 useRecordHotkeys 处理快捷键录入
    const [recordedKeys, { start, stop, isRecording, resetKeys }] = useRecordHotkeys();

    useHotkeys(
      '*',
      () => {
        inputRef.current?.blur();
      },
      {
        enableOnContentEditable: true,
        enableOnFormTags: true,
        enabled: isRecording && !disabled,
        keydown: false,
        keyup: true,
        preventDefault: true,
      },
    );

    // 处理按键，保证格式正确：修饰键在前，最多一个非修饰键在后
    const formatKeys = useCallback((keysSet: Set<string>) => {
      const modifiers: string[] = [];
      const normalKeys: string[] = [];

      for (const key of keysSet) {
        // 处理不同表示的修饰键
        const normalizedKey = key.toLowerCase();
        if (MODIFIER_KEYS.has(normalizedKey)) {
          // 统一修饰键表示
          if (
            (!isAppleDevice && normalizedKey === 'ctrl') ||
            (isAppleDevice && normalizedKey === 'meta')
          ) {
            if (!modifiers.includes('mod')) modifiers.push('mod');
          } else if (!modifiers.includes(normalizedKey)) {
            modifiers.push(normalizedKey);
          }
        } else {
          normalKeys.push(key);
        }
      }

      // 至少需要一个修饰键
      if (modifiers.length === 0 && normalKeys.length > 0) {
        return { isValid: false, keys: [] };
      }

      // 只允许一个非修饰键，如果有多个，只保留最后一个
      const finalKey = normalKeys.length > 0 ? [normalKeys.at(-1)] : [];
      const validKeys = [...modifiers, ...finalKey];

      // 组合必须包含至少一个按键
      return {
        isValid: validKeys.length > 0,
        keys: validKeys,
      };
    }, []);

    // 获取格式化后的按键字符串
    const { isValid, keys } = formatKeys(recordedKeys);
    const keysString = keys.join('+');

    // 检查快捷键冲突
    const checkHotkeyConflict = useCallback(
      (newHotkey: string): boolean => {
        return hotkeyConflicts
          .filter((conflictKey) => conflictKey !== resetValue)
          .some((conflictKey) => {
            const newKeys = splitKeysByPlus(newHotkey);
            const conflictKeys = splitKeysByPlus(conflictKey);
            return isEqual(newKeys.sort(), conflictKeys.sort());
          });
      },
      [hotkeyConflicts],
    );

    // 当按键组合完成时处理结果
    useEffect(() => {
      if (recordedKeys.size > 0 && !isRecording) {
        if (!isValid) {
          setHasInvalidCombination(true);
          setHasConflict(false);
          return;
        }

        setHasInvalidCombination(false);
        const newKeysString = keysString;

        // 检查冲突
        const conflict = checkHotkeyConflict(newKeysString);
        if (conflict) {
          setHasConflict(true);
          onConflict?.(newKeysString);
        } else {
          setHasConflict(false);
          setHotkeyValue?.(newKeysString);
        }
      }
    }, [
      recordedKeys,
      isRecording,
      isValid,
      keysString,
      checkHotkeyConflict,
      setHotkeyValue,
      onConflict,
    ]);

    // 处理输入框焦点
    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      setIsFocused(true);
      setHasConflict(false);
      setHasInvalidCombination(false);
      start(); // 开始记录
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      stop(); // 停止记录
      onBlur?.(e);
    };

    // 重置功能
    const handleReset = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setHotkeyValue?.(resetValue);
      resetKeys();
      setHasConflict(false);
      setHasInvalidCombination(false);
      setIsFocused(false);
      stop(); // 停止记录
      onReset?.(hotkeyValue, resetValue);
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || isFocused) return;
      inputRef.current?.focus();
    };

    return (
      <Flexbox
        className={className}
        gap={8}
        style={{
          position: 'relative',
          ...style,
        }}
      >
        <Flexbox
          align={'center'}
          className={cx(
            variants({
              disabled,
              error: hasConflict || hasInvalidCombination,
              focused: isFocused,
              shadow,
              variant: variant || (theme.isDarkMode ? 'filled' : 'outlined'),
            }),
          )}
          horizontal
          justify={'space-between'}
          onClick={handleClick}
        >
          <div style={{ pointerEvents: 'none' }}>
            {isRecording ? (
              <span className={styles.placeholder}>
                {keys.length > 0 ? <Hotkey keys={keysString} /> : placeholder}
              </span>
            ) : hotkeyValue ? (
              <Hotkey keys={hotkeyValue} />
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </div>

          {/* 隐藏的输入框，用于接收焦点 */}
          <input
            className={styles.hiddenInput}
            disabled={disabled}
            onBlur={handleBlur}
            onFocus={handleFocus}
            readOnly
            ref={inputRef as any}
            style={{ pointerEvents: 'none' }}
          />

          {!isFocused && allowReset && hotkeyValue && hotkeyValue !== resetValue && !disabled && (
            <ActionIcon
              icon={Undo2Icon}
              onClick={handleReset}
              size={'small'}
              title={texts?.reset || 'Reset to default'}
              variant={'filled'}
            />
          )}
        </Flexbox>
        {hasConflict && (
          <div className={styles.errorText}>
            {texts?.conflicts || 'This shortcut conflicts with an existing one.'}
          </div>
        )}
        {hasInvalidCombination && (
          <div className={styles.errorText}>
            {texts?.invalidCombination ||
              'Shortcut must include a modifier key (Ctrl, Alt, Shift) and only one regular key.'}
          </div>
        )}
      </Flexbox>
    );
  },
);

HotkeyInput.displayName = 'HotkeyInput';

export default HotkeyInput;
