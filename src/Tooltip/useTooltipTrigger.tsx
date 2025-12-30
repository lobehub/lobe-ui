import { type ReactNode, isValidElement, useMemo } from 'react';

export const useTooltipTrigger = (children: ReactNode) => {
  const trigger = useMemo(() => {
    if (!isValidElement(children)) return <span>{children}</span>;

    const needsWrapper =
      typeof children.type === 'string' && Boolean((children.props as any)?.disabled);

    if (needsWrapper) return <span style={{ display: 'inline-flex' }}>{children}</span>;

    return children;
  }, [children]);

  return trigger;
};
