import { type ElementType, isValidElement, type ReactNode } from 'react';

export type LandingIconSource = ElementType<{ size: number }> | ReactNode;

const isElementType = (icon: LandingIconSource): icon is ElementType<{ size: number }> =>
  typeof icon === 'function' ||
  (typeof icon === 'object' && icon !== null && !isValidElement(icon) && '$$typeof' in icon);

/** Renders an icon given either a component (e.g. from `@lobehub/icons`) or a ready-made node. */
export const renderLandingIcon = (icon: LandingIconSource, size: number): ReactNode => {
  if (!isElementType(icon)) return icon as ReactNode;
  const IconComponent = icon;
  return <IconComponent size={size} />;
};
