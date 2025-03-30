import { Button, type ButtonProps, Form } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { motion } from 'framer-motion';
import { merge } from 'lodash-es';
import { InfoIcon } from 'lucide-react';
import { ReactNode, memo, useEffect, useState } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

import { useFormContext } from './FormProvider';

const useStyles = createStyles(({ responsive, css, token }) => ({
  floatFooter: css`
    position: fixed;
    z-index: 1000;
    inset-block-end: 24px;
    inset-inline-start: 50%;
    transform: translateX(-50%);

    width: max-content;
    padding: 8px;

    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 48px;
    box-shadow: ${token.boxShadowSecondary};
  `,
  footer: css`
    ${responsive.mobile} {
      margin-block-start: -${token.borderRadius}px;
      padding: 16px;
      background: ${token.colorBgContainer};
      border-block-start: 1px solid ${token.colorBorderSecondary};
    }
  `,
}));

export interface FormSubmitFooterProps extends FlexboxProps {
  buttonProps?: Omit<ButtonProps, 'children'>;
  children?: ReactNode;
  enableReset?: boolean;
  enableUnsavedWarning?: boolean;
  float?: boolean;
  onReset?: () => void;
  resetButtonProps?: Omit<ButtonProps, 'children'>;
  resetText?: ReactNode;
  saveButtonProps?: Omit<ButtonProps, 'children'>;
  saveText?: ReactNode;
  texts?: {
    unSaved?: string;
    unSavedWarning?: string;
  };
}

const FormSubmitFooter = memo<FormSubmitFooterProps>(
  ({
    enableReset = true,
    buttonProps,
    float,
    saveText = 'Submit',
    resetText = 'Reset',
    onReset,
    saveButtonProps,
    resetButtonProps,
    enableUnsavedWarning = true,
    children,
    texts,
    className,
    ...rest
  }) => {
    const { form, initialValues, submitLoading } = useFormContext();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const values = Form.useWatch([], form);

    const { cx, styles, theme } = useStyles();

    useEffect(() => {
      if (!values) return;
      const v = merge({}, initialValues, values);
      setHasUnsavedChanges(!isEqual(v, initialValues));
    }, [values, initialValues, submitLoading]);

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
              size={{ fontSize: 12 }}
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
            color="default"
            htmlType="button"
            onClick={() => {
              form?.resetFields();
              onReset?.();
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
          {saveText}
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

export default FormSubmitFooter;
