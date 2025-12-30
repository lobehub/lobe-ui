import type { ElementType, FC } from 'react';

import { NativeFlexBasicElement } from './FlexBasic.web';
import { ReactFlexBasic } from './ReactFlexBasic';
import type { FlexBasicProps } from './type';

export const AutoFlex: FC<FlexBasicProps> = (props) => {
  const { as } = props;

  // `as` cannot be supported by the native custom element (tagName is fixed),
  // so we fallback to the React implementation when `as` is provided and isn't `lobe-flex`.
  if (!as || as === ('lobe-flex' as unknown as ElementType)) {
    // Avoid leaking `as` onto the custom element as an attribute.
    const rest = { ...props } as any;
    delete rest.as;
    return <NativeFlexBasicElement {...(rest as any)} />;
  }

  return <ReactFlexBasic {...props} />;
};
