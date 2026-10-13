/**
 * The styling engine (antd-style: emotion + theme hooks) through a lobe import path, for
 * components that must not import from antd packages directly, e.g. base-ui DatePicker.
 */
export { createStaticStyles, cx, useThemeMode } from 'antd-style';
