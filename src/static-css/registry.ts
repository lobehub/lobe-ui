import {
  Alert,
  Anchor,
  App,
  AutoComplete,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ColorPicker,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  FloatButton,
  Form,
  Image,
  Input,
  InputNumber,
  Mentions,
  Menu,
  Modal,
  Pagination,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Tree,
  Typography,
  Upload,
} from 'antd';
import type { ReactElement } from 'react';
import { createElement } from 'react';

export interface AntdProbeDef {
  /** antd export name whose usage activates this probe during auto scan */
  detect: string;
  render: () => ReactElement;
}

const PROBE_NAMES = [
  'alert',
  'anchor',
  'app',
  'auto-complete',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'card',
  'checkbox',
  'collapse',
  'color-picker',
  'date-picker',
  'divider',
  'drawer',
  'dropdown',
  'empty',
  'flex',
  'float-button',
  'form',
  'grid-col',
  'grid-row',
  'image',
  'input',
  'input-number',
  'input-textarea',
  'mentions',
  'menu',
  'modal',
  'pagination',
  'popover',
  'progress',
  'qrcode',
  'radio',
  'rate',
  'segmented',
  'select',
  'skeleton',
  'slider',
  'space',
  'spin',
  'steps',
  'switch',
  'table',
  'tabs',
  'tag',
  'tag-preset',
  'tag-status',
  'tooltip',
  'tree',
  'typography',
  'upload',
] as const;

export type AntdProbeName = (typeof PROBE_NAMES)[number];

export const antdProbeNames: AntdProbeName[] = [...PROBE_NAMES];

export const antdProbeRegistry: Record<AntdProbeName, AntdProbeDef> = {
  'alert': { detect: 'Alert', render: () => createElement(Alert, { message: '-' }) },
  'anchor': { detect: 'Anchor', render: () => createElement(Anchor, { items: [] }) },
  'app': { detect: 'App', render: () => createElement(App, null, '-') },
  'auto-complete': { detect: 'AutoComplete', render: () => createElement(AutoComplete) },
  'avatar': { detect: 'Avatar', render: () => createElement(Avatar) },
  'badge': { detect: 'Badge', render: () => createElement(Badge, { count: 1 }) },
  'breadcrumb': { detect: 'Breadcrumb', render: () => createElement(Breadcrumb, { items: [] }) },
  'button': { detect: 'Button', render: () => createElement(Button, null, '-') },
  'card': { detect: 'Card', render: () => createElement(Card, null, '-') },
  'checkbox': { detect: 'Checkbox', render: () => createElement(Checkbox) },
  'collapse': { detect: 'Collapse', render: () => createElement(Collapse, { items: [] }) },
  'color-picker': { detect: 'ColorPicker', render: () => createElement(ColorPicker) },
  'date-picker': { detect: 'DatePicker', render: () => createElement(DatePicker) },
  'divider': { detect: 'Divider', render: () => createElement(Divider) },
  'drawer': { detect: 'Drawer', render: () => createElement(Drawer, { open: false }) },
  'dropdown': {
    detect: 'Dropdown',
    render: () => createElement(Dropdown, { menu: { items: [] } }, createElement('span')),
  },
  'empty': { detect: 'Empty', render: () => createElement(Empty) },
  'flex': { detect: 'Flex', render: () => createElement(Flex, null, createElement('span')) },
  'float-button': { detect: 'FloatButton', render: () => createElement(FloatButton) },
  'form': {
    detect: 'Form',
    render: () =>
      createElement(Form, null, createElement(Form.Item, { label: '-' }, createElement('span'))),
  },
  'grid-col': { detect: 'Col', render: () => createElement(Col, { span: 1 }) },
  'grid-row': { detect: 'Row', render: () => createElement(Row) },
  'image': { detect: 'Image', render: () => createElement(Image, { src: '' }) },
  'input': { detect: 'Input', render: () => createElement(Input) },
  'input-number': { detect: 'InputNumber', render: () => createElement(InputNumber) },
  'input-textarea': { detect: 'Input', render: () => createElement(Input.TextArea) },
  'mentions': { detect: 'Mentions', render: () => createElement(Mentions) },
  'menu': { detect: 'Menu', render: () => createElement(Menu, { items: [] }) },
  'modal': { detect: 'Modal', render: () => createElement(Modal, { open: false }) },
  'pagination': { detect: 'Pagination', render: () => createElement(Pagination) },
  'popover': {
    detect: 'Popover',
    render: () => createElement(Popover, null, createElement('span')),
  },
  'progress': { detect: 'Progress', render: () => createElement(Progress, { percent: 0 }) },
  'qrcode': { detect: 'QRCode', render: () => createElement(QRCode, { value: '-' }) },
  'radio': { detect: 'Radio', render: () => createElement(Radio) },
  'rate': { detect: 'Rate', render: () => createElement(Rate) },
  'segmented': { detect: 'Segmented', render: () => createElement(Segmented, { options: ['-'] }) },
  'select': { detect: 'Select', render: () => createElement(Select) },
  'skeleton': { detect: 'Skeleton', render: () => createElement(Skeleton) },
  'slider': { detect: 'Slider', render: () => createElement(Slider) },
  'space': { detect: 'Space', render: () => createElement(Space, null, createElement('span')) },
  'spin': { detect: 'Spin', render: () => createElement(Spin) },
  'steps': { detect: 'Steps', render: () => createElement(Steps, { items: [] }) },
  'switch': { detect: 'Switch', render: () => createElement(Switch) },
  'table': { detect: 'Table', render: () => createElement(Table, { columns: [], dataSource: [] }) },
  'tabs': { detect: 'Tabs', render: () => createElement(Tabs, { items: [] }) },
  'tag': { detect: 'Tag', render: () => createElement(Tag, null, '-') },
  'tag-preset': { detect: 'Tag', render: () => createElement(Tag, { color: 'blue' }, '-') },
  'tag-status': { detect: 'Tag', render: () => createElement(Tag, { color: 'success' }, '-') },
  'tooltip': {
    detect: 'Tooltip',
    render: () => createElement(Tooltip, { title: '-' }, createElement('span')),
  },
  'tree': { detect: 'Tree', render: () => createElement(Tree, { treeData: [] }) },
  'typography': { detect: 'Typography', render: () => createElement(Typography.Text, null, '-') },
  'upload': { detect: 'Upload', render: () => createElement(Upload) },
};

// Imperative or unstyled antd exports the scanner may find but no probe should cover.
export const nonProbeAntdExports = new Set([
  'ConfigProvider',
  'Grid',
  'message',
  'notification',
  'theme',
  // kebabToPascal('antd/es/theme') during deep-import scan
  'Theme',
  'version',
]);

export interface ExpandedProbes {
  probes: AntdProbeName[];
  unmatched: string[];
}

export const expandComponentsToProbes = (components: Iterable<string>): ExpandedProbes => {
  const probes = new Set<AntdProbeName>();
  const unmatched: string[] = [];

  for (const component of components) {
    let matched = false;
    for (const name of antdProbeNames) {
      if (antdProbeRegistry[name].detect === component) {
        probes.add(name);
        matched = true;
      }
    }
    if (!matched && !nonProbeAntdExports.has(component)) unmatched.push(component);
  }

  return { probes: [...probes].sort(), unmatched: unmatched.sort() };
};
