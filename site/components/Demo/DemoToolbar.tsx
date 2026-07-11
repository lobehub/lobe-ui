import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
  SelectHTMLAttributes,
} from 'react';

export default function DemoToolbar({ children }: PropsWithChildren) {
  return (
    <div
      aria-label="Demo controls"
      className="demo-toolbar"
      data-pagefind-ignore="all"
      role="toolbar"
    >
      {children}
    </div>
  );
}

export function DemoToolbarButton({
  children,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={['demo-toolbar__control', className].filter(Boolean).join(' ')}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function DemoToolbarLink({
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={['demo-toolbar__control', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </a>
  );
}

export function DemoToolbarSelect({
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={['demo-toolbar__control', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </select>
  );
}
