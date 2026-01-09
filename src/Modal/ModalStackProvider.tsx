'use client';

import type { Context, ReactNode } from 'react';
import { createContext, memo, use, useMemo } from 'react';

import {
  createModal,
  createModalWithBridge,
  createRawModal,
  createRawModalWithBridge,
} from './imperative';
import type { ContextBridgeComponent, ModalStackContextValue } from './type';

export const ModalStackContext = createContext<ModalStackContextValue | null>(null);

// 辅助组件：递归包裹 context providers
const ContextWrapper = ({
  children,
  contexts,
  values,
}: {
  children: ReactNode;
  contexts: Context<any>[];
  values: any[];
}) => {
  if (contexts.length === 0) return children;

  const [FirstContext, ...restContexts] = contexts;
  const [firstValue, ...restValues] = values;

  return (
    <FirstContext value={firstValue}>
      <ContextWrapper contexts={restContexts} values={restValues}>
        {children}
      </ContextWrapper>
    </FirstContext>
  );
};

// 内部组件：在 render 阶段消费 contexts 并创建 bridge
const ModalStackProviderInner = ({
  children,
  contexts,
}: {
  children: ReactNode;
  contexts: Context<any>[];
}) => {
  // 在 render 阶段消费所有 context 的值
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contextValues = contexts.map((ctx) => use(ctx));

  // 创建 bridge 组件，捕获当前的 context 值
  const BridgeComponent: ContextBridgeComponent = useMemo(() => {
    return ({ children: bridgeChildren }: { children: ReactNode }) => (
      <ContextWrapper contexts={contexts} values={contextValues}>
        {bridgeChildren}
      </ContextWrapper>
    );
  }, [contexts, contextValues]);

  const value = useMemo<ModalStackContextValue>(
    () => ({
      createModal: (props) => {
        return createModalWithBridge(props, BridgeComponent);
      },
      createRawModal: ((component: any, props: any, options: any) => {
        return createRawModalWithBridge(component, props, options, BridgeComponent);
      }) as ModalStackContextValue['createRawModal'],
    }),
    [BridgeComponent],
  );

  return <ModalStackContext value={value}>{children}</ModalStackContext>;
};

const EMPTY_ARRAY: Context<any>[] = [];
export const ModalStackProvider = memo<{
  children: ReactNode;
  contexts: Context<any>[];
}>(({ children, contexts = EMPTY_ARRAY }) => {
  return <ModalStackProviderInner contexts={contexts}>{children}</ModalStackProviderInner>;
});

ModalStackProvider.displayName = 'ModalStackProvider';

export const useModalStack = (): ModalStackContextValue => {
  const ctx = use(ModalStackContext);
  if (!ctx) {
    // fallback 到全局 API（无 bridge）
    return {
      createModal,
      createRawModal,
    };
  }
  return ctx;
};
