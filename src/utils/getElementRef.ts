import { isValidElement, type Ref, version } from 'react';

const IS_REACT_19 = Number.parseInt(version, 10) >= 19;

/**
 * The ref attached to a React element. React 19 moved it to `props.ref` and warns
 * ("Accessing element.ref was removed in React 19") when `element.ref` is read; React 18
 * keeps it on the element.
 */
export const getElementRef = <T = unknown>(element: unknown): Ref<T> | undefined => {
  if (!isValidElement(element)) return undefined;
  if (IS_REACT_19) return (element.props as { ref?: Ref<T> } | null)?.ref;
  return (element as unknown as { ref?: Ref<T> }).ref;
};
