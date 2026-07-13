'use client';

import { cssVar, cx } from 'antd-style';
import { InfoIcon } from 'lucide-react';
import { memo, useEffect } from 'react';

import Button from '@/base-ui/Button';
import { Flexbox } from '@/Flex';
import formMessages from '@/i18n/resources/en/form';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import { useMotionComponent } from '@/MotionProvider';

import { useFormContext } from '../context';
import { submitFooterStyles as styles } from '../style';
import type { FormSubmitFooterProps } from '../type';

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
    const Motion = useMotionComponent();
    const { hasUnsavedChanges, requestReset, submitLoading } = useFormContext();
    const { t } = useTranslation(formMessages);

    const unsavedWarningText = texts?.unSavedWarning ?? t('form.unsavedWarning');
    const unsavedText = texts?.unSaved ?? t('form.unsavedChanges');
    const resetText = texts?.reset ?? t('form.reset');
    const submitText = texts?.submit ?? t('form.submit');

    useEffect(() => {
      if (!enableUnsavedWarning || typeof window === 'undefined' || !hasUnsavedChanges) return;
      const fn = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = unsavedWarningText;
      };
      window.addEventListener('beforeunload', fn);
      return () => window.removeEventListener('beforeunload', fn);
    }, [enableUnsavedWarning, hasUnsavedChanges, unsavedWarningText]);

    const content = (
      <>
        {(float || hasUnsavedChanges) && (
          <>
            <Icon
              color={cssVar.colorTextDescription}
              icon={InfoIcon}
              size={12}
              style={{ marginLeft: 8 }}
            />
            <span
              style={{
                color: cssVar.colorTextDescription,
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
            htmlType={'button'}
            shape={float ? 'round' : undefined}
            type={'fill'}
            onClick={() => {
              requestReset();
              onReset?.();
            }}
            {...buttonProps}
            {...resetButtonProps}
          >
            {resetText}
          </Button>
        )}
        <Button
          htmlType={'submit'}
          loading={submitLoading}
          shape={float ? 'round' : undefined}
          type={'primary'}
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
          horizontal
          align={'center'}
          className={cx(styles.footer, className)}
          gap={8}
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
          horizontal
          align={'center'}
          className={className}
          gap={8}
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
