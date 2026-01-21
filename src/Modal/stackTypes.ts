import type {
  ContextBridgeComponent,
  ImperativeModalProps,
  RawModalComponent,
  RawModalOptions,
} from './type';

export type ModalStackItemBase = {
  bridge?: ContextBridgeComponent;
  id: string;
};

export type ModalStackItemModal = ModalStackItemBase & {
  kind: 'modal';
  props: ImperativeModalProps;
};

export type ModalStackItemRaw = ModalStackItemBase & {
  component: RawModalComponent;
  kind: 'raw';
  open: boolean;
  options?: RawModalOptions<PropertyKey, PropertyKey>;
  props: Record<string, unknown>;
};

export type TModalStackItem = ModalStackItemModal | ModalStackItemRaw;

export type ModalStackProps = {
  stack: TModalStackItem[];
};

export type ModalHostProps = {
  root?: HTMLElement | ShadowRoot | null;
};
