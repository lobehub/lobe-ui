import { clsx } from 'clsx';
import * as React from 'react';

import type { GenerateConfig } from '../../generate';
import useTimeInfo from '../../hooks/useTimeInfo';
import type { DisabledDate, InternalMode, PanelMode, SharedPickerProps } from '../../interface';
import { isReactRenderable } from '../../utils/common';
import PickerContext from '../context';
import type { PopupShowTimeConfig } from '.';

export interface FooterProps<DateType extends object = any> {
  disabledDate: DisabledDate<DateType>;
  generateConfig: GenerateConfig<DateType>;
  internalMode: InternalMode;
  // Invalid
  /** From Footer component used only. Check if can OK button click */
  invalid?: boolean;
  mode: PanelMode;
  needConfirm: boolean;
  // Now
  onNow: (now: DateType) => void;

  // Submit
  onSubmit: (date?: DateType) => void;

  renderExtraFooter?: SharedPickerProps['renderExtraFooter'];
  showNow: boolean;

  showTime?: PopupShowTimeConfig<DateType> | null;
}

export default function Footer(props: FooterProps) {
  const {
    mode,
    internalMode,
    renderExtraFooter,
    showNow,
    showTime,
    onSubmit,
    onNow,
    invalid,
    needConfirm,
    generateConfig,
    disabledDate,
  } = props;

  const {
    prefixCls,
    locale,
    button: Button = 'button',
    classNames,
    styles,
  } = React.use(PickerContext);

  // >>> Now
  const now = generateConfig.getNow();

  const [getValidTime] = useTimeInfo(generateConfig, showTime, now);

  // ======================== Extra =========================
  const extraNode = renderExtraFooter?.(mode);

  // ======================== Ranges ========================
  const nowDisabled = disabledDate(now, {
    type: mode,
  });

  const onInternalNow = () => {
    if (!nowDisabled) {
      const validateNow = getValidTime(now);
      onNow(validateNow);
    }
  };

  const nowPrefixCls = `${prefixCls}-now`;
  const nowBtnPrefixCls = `${nowPrefixCls}-btn`;

  const presetNode = showNow && (
    <li className={nowPrefixCls}>
      <a
        aria-disabled={nowDisabled}
        className={clsx(nowBtnPrefixCls, nowDisabled && `${nowBtnPrefixCls}-disabled`)}
        onClick={onInternalNow}
      >
        {internalMode === 'date' ? locale.today : locale.now}
      </a>
    </li>
  );

  // >>> OK
  const okNode = needConfirm && (
    <li className={`${prefixCls}-ok`}>
      <Button disabled={invalid} onClick={onSubmit}>
        {locale.ok}
      </Button>
    </li>
  );

  const rangeNode = (presetNode || okNode) && (
    <ul className={`${prefixCls}-ranges`}>
      {presetNode}
      {okNode}
    </ul>
  );

  // ======================== Render ========================
  if (!isReactRenderable(extraNode) && !isReactRenderable(rangeNode)) {
    return null;
  }

  return (
    <div
      className={clsx(`${prefixCls}-footer`, classNames.popup.footer)}
      style={styles.popup.footer}
    >
      {isReactRenderable(extraNode) && (
        <div className={`${prefixCls}-footer-extra`}>{extraNode}</div>
      )}
      {rangeNode}
    </div>
  );
}
