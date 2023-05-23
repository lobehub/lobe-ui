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
  label: ReactNode;
  disabled?: boolean;
  active?: boolean;
  selected?: boolean;
  nested?: boolean;
  icon?: ReactNode;
  shortcut?: string[];
}

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ label, icon, disabled, nested, shortcut, active, selected, ...props }, ref) => {
    const { styles, cx } = useStyles();
    return (
      <button
        type={'button'}
        {...props}
        ref={ref}
        role="menuitem"
        disabled={disabled}
        className={cx(styles.item, {
          [styles.selected]: selected,
          [styles.active]: active,
        })}
      >
        <Flexbox horizontal gap={8}>
          {icon && <span>{icon}</span>}
          {label}
        </Flexbox>
        {nested ? (
          <span aria-hidden>
            <ChevronRightIcon className={styles.arrow} />
          </span>
        ) : shortcut ? (
          <Flexbox horizontal align={'center'}>
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
