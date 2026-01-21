import { closeModal, destroyModal, updateModal } from './operations';
import { getModalStack, incrementModalSeed, notify, setModalStack } from './store';
import type { ContextBridgeComponent, ImperativeModalProps, ModalInstance } from './type';

export const createModal = (props: ImperativeModalProps): ModalInstance => {
  const id = `modal-${Date.now()}-${incrementModalSeed()}`;
  const modalStack = getModalStack();
  setModalStack([
    ...modalStack,
    { id, kind: 'modal', props: { ...props, open: props.open ?? true } },
  ]);
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateModal(id, { maskClosable: value }),
    update: (nextProps) => updateModal(id, nextProps),
  };
};

export const createModalWithBridge = (
  props: ImperativeModalProps,
  bridge?: ContextBridgeComponent,
): ModalInstance => {
  const id = `modal-${Date.now()}-${incrementModalSeed()}`;
  const modalStack = getModalStack();
  setModalStack([
    ...modalStack,
    { bridge, id, kind: 'modal', props: { ...props, open: props.open ?? true } },
  ]);
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateModal(id, { maskClosable: value }),
    update: (nextProps) => updateModal(id, nextProps),
  };
};
