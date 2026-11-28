'use client';

import clsx from 'clsx';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { type KeyboardEvent, memo, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import comboboxMessages from '@/i18n/resources/en/combobox';
import { useTranslation } from '@/i18n/useTranslation';
import PlaygroundField from '@/internal/a2ui/playgroundField';
import PlaygroundPopover from '@/internal/a2ui/PlaygroundPopover';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { comboboxClasses } from './stable';
import { styles } from './style';
import type { ComboboxOption, ComboboxProps } from './type';

const toOption = (option: string | ComboboxOption): ComboboxOption =>
  typeof option === 'string' ? { value: option } : option;

const searchText = (option: ComboboxOption) =>
  [typeof option.label === 'string' ? option.label : '', option.value, option.keywords ?? '']
    .join(' ')
    .toLowerCase();

/**
 * A searchable single choice for long option lists (countries, cities, timezones): a trigger that
 * opens a search field over a filtered list. A lobe-ui look by default, the A2UI playground look
 * with `variant="a2ui"`. Adapted from CopilotKit a2ui-playground (MIT), `renderers/inputs.tsx`
 * Combobox (shadcn `Popover` + cmdk `Command`).
 */
const Combobox = memo<ComboboxProps>(
  ({
    className,
    classNames,
    defaultOpen,
    defaultValue,
    disabled,
    id: idProp,
    label,
    onChange,
    onOpenChange,
    open: openProp,
    options,
    placeholder,
    ref,
    style,
    styles: customStyles,
    texts,
    value,
    variant = 'default',
  }) => {
    const isA2ui = variant === 'a2ui';
    const autoId = useId();
    const id = idProp ?? autoId;
    const listId = `${id}-list`;
    const { t } = useTranslation(comboboxMessages);
    const [current, setCurrent] = useControlledState<string | undefined>(undefined, {
      defaultValue,
      value,
    });
    const [open, setOpen] = useControlledState(false, {
      defaultValue: defaultOpen,
      onChange: onOpenChange,
      value: openProp,
    });
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const items = useMemo(() => options.map(toOption), [options]);
    const selected = items.find((item) => item.value === current);
    const visible = useMemo(() => {
      const q = query.trim().toLowerCase();
      return q ? items.filter((item) => searchText(item).includes(q)) : items;
    }, [items, query]);

    // Like cmdk: the first match is active whenever the list or the search changes.
    useEffect(() => setActive(0), [query, open]);
    useEffect(() => {
      listRef.current
        ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
        ?.scrollIntoView?.({ block: 'nearest' });
    }, [active]);

    const handleOpenChange = (next: boolean) => {
      if (next) setQuery('');
      setOpen(next);
    };

    const pick = (option: ComboboxOption) => {
      if (option.disabled) return;
      setCurrent(option.value);
      onChange?.(option.value, option);
      setOpen(false);
    };

    const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (visible.length === 0) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive((index) => (index + step + visible.length) % visible.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const option = visible[active];
        if (option) pick(option);
      }
    };

    const trigger = (
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        disabled={disabled}
        id={id}
        role="combobox"
        type="button"
        {...styleProps(
          [styles.trigger, isA2ui ? styles.a2uiTrigger : styles.dTrigger],
          clsx(comboboxClasses('trigger'), classNames?.trigger),
          customStyles?.trigger,
        )}
      >
        <span
          {...styleProps(
            [styles.truncate, !selected && (isA2ui ? styles.placeholder : styles.dPlaceholder)],
            comboboxClasses('value'),
          )}
        >
          {selected
            ? (selected.label ?? selected.value)
            : (placeholder ?? texts?.placeholder ?? t('combobox.placeholder'))}
        </span>
        <ChevronsUpDown aria-hidden size={14} {...styleProps(styles.chevron)} />
      </button>
    );

    return (
      <div
        ref={ref}
        {...toDataAttributes({ variant })}
        {...styleProps(undefined, clsx(comboboxClasses(), className, classNames?.root), {
          ...style,
          ...customStyles?.root,
        })}
      >
        <PlaygroundField
          htmlFor={id}
          label={label}
          labelClassName={clsx(comboboxClasses('label'), classNames?.label)}
          labelStyle={customStyles?.label}
          variant={variant}
        >
          <PlaygroundPopover
            matchTriggerWidth
            className={clsx(comboboxClasses('popup'), classNames?.popup)}
            minWidth={208}
            open={open}
            popupStyle={customStyles?.popup}
            trigger={trigger}
            variant={variant}
            onOpenChange={handleOpenChange}
          >
            <div {...styleProps(isA2ui ? styles.command : styles.dCommand)}>
              <div {...styleProps(isA2ui ? styles.a2uiSearchWrap : styles.dSearchWrap)}>
                <div
                  {...styleProps(
                    [styles.search, isA2ui ? styles.a2uiSearch : styles.dSearch],
                    comboboxClasses('search'),
                  )}
                >
                  <Search aria-hidden size={16} {...styleProps(styles.searchIcon)} />
                  <input
                    autoFocus
                    aria-autocomplete="list"
                    aria-controls={listId}
                    placeholder={texts?.search ?? t('combobox.search')}
                    value={query}
                    aria-activedescendant={
                      visible[active] ? `${id}-option-${visible[active].value}` : undefined
                    }
                    {...styleProps([
                      styles.searchInput,
                      isA2ui ? styles.a2uiSearchInput : styles.dSearchInput,
                    ])}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={onSearchKeyDown}
                  />
                </div>
              </div>
              <div
                id={listId}
                ref={listRef}
                role="listbox"
                {...styleProps(styles.list, comboboxClasses('list'))}
              >
                {visible.length === 0 ? (
                  <div
                    {...styleProps(isA2ui ? styles.empty : styles.dEmpty, comboboxClasses('empty'))}
                  >
                    {texts?.empty ?? t('combobox.empty')}
                  </div>
                ) : (
                  <div {...styleProps(styles.group)}>
                    {visible.map((option, index) => {
                      const checked = option.value === current;
                      const isActive = index === active;
                      return (
                        <div
                          aria-disabled={option.disabled || undefined}
                          aria-selected={checked}
                          data-index={index}
                          id={`${id}-option-${option.value}`}
                          key={option.value}
                          role="option"
                          {...toDataAttributes({ active: isActive, checked })}
                          {...styleProps(
                            [
                              styles.item,
                              isA2ui ? styles.a2uiItem : styles.dItem,
                              isActive && (isA2ui ? styles.a2uiItemActive : styles.dItemActive),
                              option.disabled && styles.itemDisabled,
                            ],
                            clsx(comboboxClasses('item'), classNames?.item),
                            customStyles?.item,
                          )}
                          onClick={() => pick(option)}
                          onMouseMove={() => !isActive && setActive(index)}
                        >
                          <span {...styleProps(styles.truncate)}>
                            {option.label ?? option.value}
                          </span>
                          <Check
                            aria-hidden
                            size={16}
                            {...styleProps(
                              [styles.check, checked && styles.checkOn],
                              comboboxClasses('check'),
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </PlaygroundPopover>
        </PlaygroundField>
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';

export default Combobox;
