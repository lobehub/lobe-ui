import { mergeProps } from '@base-ui/react/merge-props';
import { type ReactElement, cloneElement } from 'react';
import { mergeRefs } from 'react-merge-refs';

type RenderTooltipTriggerOptions = {
  child: ReactElement;
  isNativeButtonTriggerElement: boolean;
  ref: unknown;
  renderProps: unknown;
};

const FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const MEMO_TYPE = Symbol.for('react.memo');

const isForwardRefComponent = (type: unknown) => {
  if (typeof type !== 'object' || type === null) return false;
  if ((type as any).$$typeof === FORWARD_REF_TYPE) return true;
  return (type as any).$$typeof === MEMO_TYPE && (type as any).type?.$$typeof === FORWARD_REF_TYPE;
};

const shouldWrapTooltipTrigger = (child: ReactElement) => {
  const { type } = child;
  const isNativeElement = typeof type === 'string';
  const isClassComponent =
    typeof type === 'function' && Boolean((type as any).prototype?.isReactComponent);
  const isForwardRef = isForwardRefComponent(type);

  return !isNativeElement && !isClassComponent && !isForwardRef;
};

const resolveTriggerProps = (renderProps: unknown, isNativeButtonTriggerElement: boolean) => {
  // Base UI's trigger props include `type="button"` by default.
  // If we render into a non-<button> element, that prop is invalid and can warn.
  if (isNativeButtonTriggerElement) return renderProps as any;
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  const { type, ref, ...restProps } = renderProps as any;
  return restProps;
};

export const renderTooltipTriggerElement = ({
  child,
  renderProps,
  isNativeButtonTriggerElement,
  ref,
}: RenderTooltipTriggerOptions) => {
  const resolvedProps = resolveTriggerProps(renderProps, isNativeButtonTriggerElement);

  if (!shouldWrapTooltipTrigger(child)) {
    const mergedProps = mergeProps((child as any).props, resolvedProps);
    return cloneElement(child as any, {
      ...mergedProps,
      ref: mergeRefs([(child as any).ref, (renderProps as any).ref, ref]),
    });
  }

  const { style: triggerStyle, ...restProps } = resolvedProps as any;
  return (
    <span
      {...restProps}
      ref={mergeRefs([(renderProps as any).ref, ref])}
      style={{ display: 'inline-flex', ...triggerStyle }}
    >
      {child}
    </span>
  );
};
