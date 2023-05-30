import { ChevronRightIcon } from 'lucide-react';
import { forwardRef, ReactNode } from 'react';
import { Flexbox } from 'react-layout-kit';

import { AltIcon, CommandIcon, ControlIcon, ShiftIcon } from './icons';
import { useStyles } from './style';

const KEYBOARD_ICON_MAP: Record<string, any> = {
  meta: <CommandIcon />,
  control: <ControlIcon />,

  shift: <ShiftIcon />,
  alt: <AltIcon />,
  enter: '↵',
};

const CODE_MAP: Record<string, 'meta' | 'control' | 'shift' | 'alt'> = {
  meta: 'meta',
  command: 'meta',
  cmd: 'meta',
  ctl: 'control',
  control: 'control',
  shift: 'shift',
  alt: 'alt',
};

interface MenuItemProps {
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  label: ReactNode;
  nested?: boolean;
  selected?: boolean;
  shortcut?: string[];
}

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ label, icon, disabled, nested, shortcut, active, selected, ...props }, ref) => {
    const { styles, cx } = useStyles();
    return (
      <button
        type={'button'}
        {...props}
        className={cx(styles.item, {
          [styles.selected]: selected,
          [styles.active]: active,
        })}
        disabled={disabled}
        ref={ref}
        role="menuitem"
      >
        <Flexbox gap={8} horizontal>
          {icon && <span>{icon}</span>}
          {label}
        </Flexbox>
        {nested ? (
          <span aria-hidden>
            <ChevronRightIcon className={styles.arrow} />
          </span>
        ) : shortcut ? (
          <Flexbox align={'center'} horizontal>
            {shortcut.map((c) => {
              const code = CODE_MAP[c.toLowerCase()];

              return (
                <kbd className={styles.kbd} key={c}>
                  {code ? KEYBOARD_ICON_MAP[code] : c.toUpperCase()}
                </kbd>
              );
            })}
          </Flexbox>
        ) : null}
      </button>
    );
  },
);

export default MenuItem;
