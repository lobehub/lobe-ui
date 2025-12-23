'use client';

import { Form } from 'antd';
import isEqual from 'fast-deep-equal';
import { InfoIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useEffect, useMemo, useState } from 'react';

import Button from '@/Button';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import formMessages from '@/i18n/resources/form';
import { useTranslation } from '@/i18n/useTranslation';

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
    const { form, initialValues, submitLoading } = useFormContext();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const values = Form.useWatch([], form) || {};
    const { t } = useTranslation(formMessages);

    const { cx, styles, theme } = useStyles();

    const v = useMemo(() => removeUndefined(values), [values]);

    const initialV = useMemo(() => removeUndefined(initialValues), [initialValues]);

    const mergedV = useMemo(() => merge(initialV, v), [v, initialV]);

    useEffect(() => {
      setHasUnsavedChanges(!isEqual(mergedV, initialV));
    }, [mergedV, initialV, submitLoading]);

    const unsavedWarningText = texts?.unSavedWarning ?? t('form.unsavedWarning');
    const unsavedText = texts?.unSaved ?? t('form.unsavedChanges');
    const resetText = texts?.reset ?? t('form.reset');
    const submitText = texts?.submit ?? t('form.submit');

    const fn = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.returnValue = unsavedWarningText;
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
    }, [enableUnsavedWarning, hasUnsavedChanges, unsavedWarningText]);

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
              {unsavedText}
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
            {resetText}
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
          {submitText}
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
      <motion.div
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
      </motion.div>
    );
  },
);

FormSubmitFooter.displayName = 'FormSubmitFooter';

export default FormSubmitFooter;
