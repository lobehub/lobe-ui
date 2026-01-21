import { closeModal, destroyModal, updateRawProps } from './operations';
import { getModalStack, incrementModalSeed, notify, setModalStack } from './store';
import type {
  ContextBridgeComponent,
  RawModalComponent,
  RawModalComponentProps,
  RawModalInstance,
  RawModalKeyOptions,
  RawModalOptions,
} from './type';

export function createRawModal<P extends RawModalComponentProps>(
  component: RawModalComponent<P>,
  props: Omit<P, 'open' | 'onClose'>,
  options?: RawModalOptions,
): RawModalInstance<P>;
// eslint-disable-next-line no-redeclare
export function createRawModal<P, OpenKey extends keyof P, CloseKey extends keyof P>(
  component: RawModalComponent<P>,
  props: Omit<P, OpenKey | CloseKey>,
  options: RawModalKeyOptions<OpenKey, CloseKey>,
): RawModalInstance<P, OpenKey, CloseKey>;
// eslint-disable-next-line no-redeclare
export function createRawModal<P, OpenKey extends keyof P, CloseKey extends keyof P>(
  component: RawModalComponent<P>,
  props: Omit<P, OpenKey | CloseKey>,
  options?: RawModalOptions<OpenKey, CloseKey>,
): RawModalInstance<P, OpenKey, CloseKey> {
  const id = `modal-${Date.now()}-${incrementModalSeed()}`;
  const modalStack = getModalStack();
  setModalStack([
    ...modalStack,
    {
      component,
      id,
      kind: 'raw',
      open: true,
      options,
      props: props as Record<string, unknown>,
    },
  ]);
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateRawProps(id, { maskClosable: value }),
    update: (nextProps) => updateRawProps(id, nextProps as Record<string, unknown>),
  };
}

export function createRawModalWithBridge<P extends RawModalComponentProps>(
  component: RawModalComponent<P>,
  props: Omit<P, 'open' | 'onClose'>,
  options: RawModalOptions | undefined,
  bridge?: ContextBridgeComponent,
): RawModalInstance<P>;
// eslint-disable-next-line no-redeclare
export function createRawModalWithBridge<P, OpenKey extends keyof P, CloseKey extends keyof P>(
  component: RawModalComponent<P>,
  props: Omit<P, OpenKey | CloseKey>,
  options: RawModalKeyOptions<OpenKey, CloseKey> | undefined,
  bridge?: ContextBridgeComponent,
): RawModalInstance<P, OpenKey, CloseKey>;
// eslint-disable-next-line no-redeclare
export function createRawModalWithBridge<P, OpenKey extends keyof P, CloseKey extends keyof P>(
  component: RawModalComponent<P>,
  props: Omit<P, OpenKey | CloseKey>,
  options?: RawModalOptions<OpenKey, CloseKey>,
  bridge?: ContextBridgeComponent,
): RawModalInstance<P, OpenKey, CloseKey> {
  const id = `modal-${Date.now()}-${incrementModalSeed()}`;
  const modalStack = getModalStack();
  setModalStack([
    ...modalStack,
    {
      bridge,
      component,
      id,
      kind: 'raw',
      open: true,
      options,
      props: props as Record<string, unknown>,
    },
  ]);
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateRawProps(id, { maskClosable: value }),
    update: (nextProps) => updateRawProps(id, nextProps as Record<string, unknown>),
  };
}
