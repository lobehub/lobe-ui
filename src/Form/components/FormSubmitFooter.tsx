'use client';

import { Form } from 'antd';
import isEqual from 'fast-deep-equal';
import { InfoIcon } from 'lucide-react';
import { memo, use, useEffect, useMemo, useState } from 'react';

import Button from '@/Button';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { MotionComponent } from '@/MotionProvider';

import { useSubmitFooterStyles as useStyles } from '../style';
import type { FormSubmitFooterProps } from '../type';
import { useFormContext } from './FormProvider';
import { merge, removeUndefined } from './merge';

const FormSubmitFooter = memo<FormSubmitFooterProps>(
  ({
    enableReset = true,
    buttonProps,
    float,
    onReset,
    saveButtonProps,
    resetButtonProps,
    enableUnsavedWarning,
    children,
    texts,
    className,
    ...rest
  }) => {
    const Motion = use(MotionComponent);
    const { form, initialValues, submitLoading } = useFormContext();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const values = Form.useWatch([], form) || {};

    const { cx, styles, theme } = useStyles();

    const v = useMemo(() => removeUndefined(values), [values]);

    const initialV = useMemo(() => removeUndefined(initialValues), [initialValues]);

    const mergedV = useMemo(() => merge(initialV, v), [v, initialV]);

    useEffect(() => {
      setHasUnsavedChanges(!isEqual(mergedV, initialV));
    }, [mergedV, initialV, submitLoading]);

    const fn = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.returnValue =
          texts?.unSavedWarning || 'You have unsaved changes. Are you sure you want to leave?';
      } else {
        delete e.returnValue;
      }
    };

    useEffect(() => {
      if (!enableUnsavedWarning) return;
      if (typeof window === 'undefined' || !hasUnsavedChanges) return;
      // 添加离开页面的提示
      window.addEventListener('beforeunload', fn);
      return () => window.removeEventListener('beforeunload', fn);
    }, [enableUnsavedWarning, hasUnsavedChanges]);

    const content = (
      <>
        {(float || hasUnsavedChanges) && (
          <>
            <Icon
              color={theme.colorTextDescription}
              icon={InfoIcon}
              size={12}
              style={{ marginLeft: 8 }}
            />
            <span
              style={{
                color: theme.colorTextDescription,
                flex: 'none',
                fontSize: 12,
                marginRight: float ? 16 : 4,
              }}
            >
              {texts?.unSaved || 'Unsaved changes'}
            </span>
          </>
        )}
        {children}
        {enableReset && (float || hasUnsavedChanges) && (
          <Button
            htmlType="button"
            onClick={() => {
              onReset?.(v, initialV);
              form?.resetFields();
            }}
            shape={float ? 'round' : undefined}
            variant={'filled'}
            {...buttonProps}
            {...resetButtonProps}
          >
            {texts?.reset || 'Reset'}
          </Button>
        )}
        <Button
          htmlType="submit"
          loading={submitLoading}
          shape={float ? 'round' : undefined}
          type="primary"
          {...buttonProps}
          {...saveButtonProps}
        >
          {texts?.submit || 'Submit'}
        </Button>
      </>
    );

    if (!float)
      return (
        <Flexbox
          align={'center'}
          className={cx(styles.footer, className)}
          gap={8}
          horizontal
          justify={'flex-end'}
          {...rest}
        >
          {content}
        </Flexbox>
      );

    return (
      <Motion.div
        animate={hasUnsavedChanges ? 'visible' : 'hidden'}
        className={styles.floatFooter}
        initial={'hidden'}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        variants={{
          hidden: {
            opacity: 0,
            x: '-50%',
            y: 20,
          },
          visible: {
            opacity: 1,
            x: '-50%',
            y: 0,
          },
        }}
      >
        <Flexbox
          align={'center'}
          className={className}
          gap={8}
          horizontal
          justify={'center'}
          {...rest}
        >
          {content}
        </Flexbox>
      </Motion.div>
    );
  },
);

FormSubmitFooter.displayName = 'FormSubmitFooter';

export default FormSubmitFooter;
