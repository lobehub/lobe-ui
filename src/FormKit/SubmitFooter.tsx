'use client';

import clsx from 'clsx';
import { memo, useMemo } from 'react';

import formMessages from '@/i18n/resources/en/form';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStandardButtonStyles } from '@/internal/a2ui/standardField';
import { styleProps } from '@/styles/stylex/props';

import FormSubmitFooter from '../Form/components/FormSubmitFooter';
import { FormContext } from '../Form/context';
import type { FormSubmitFooterProps } from '../Form/type';
import { styles as a2uiFormStyles } from './a2uiStyle';
import { useFormKitContext } from './context';
import { getInternals } from './instance';
import { formKitClasses } from './stable';
import { useStoreSelector } from './useStoreSelector';

const SubmitFooter = memo<FormSubmitFooterProps>((props) => {
  const { form, layout, variant } = useFormKitContext();
  const { engine } = getInternals(form);
  const status = useStoreSelector(engine, (e) => e.getStatus());
  const { t } = useTranslation(formMessages);

  const legacyContext = useMemo(
    () => ({
      hasUnsavedChanges: status.dirty,
      layout,
      requestReset: () => form.reset(),
      submitLoading: status.submitting,
      variant: variant === 'a2ui' ? ('borderless' as const) : variant,
    }),
    [form, layout, status.dirty, status.submitting, variant],
  );

  if (variant === 'a2ui') {
    // The A2UI form's submit row: a `Row` of standard `Button`s at the end (CopilotKit Gen UI 2.0
    // standard catalog, MIT): an outlined reset and a primary submit, 36px pills.
    const { className, enableReset = true, onReset, style, texts } = props;
    return (
      <div
        {...styleProps(
          a2uiFormStyles.submitRow,
          clsx(formKitClasses('submit-footer'), className),
          style,
        )}
      >
        {enableReset && (
          <button
            type="button"
            {...styleProps([a2uiStandardButtonStyles.root, a2uiStandardButtonStyles.default])}
            onClick={() => {
              form.reset();
              onReset?.();
            }}
          >
            {texts?.reset ?? t('form.reset')}
          </button>
        )}
        <button
          disabled={status.submitting}
          type="submit"
          {...styleProps([
            a2uiStandardButtonStyles.root,
            a2uiStandardButtonStyles.primary,
            // Alone it fills the column, like a lone Button in the official Form.
            !enableReset && a2uiFormStyles.block,
          ])}
        >
          {texts?.submit ?? t('form.submit')}
        </button>
      </div>
    );
  }

  return (
    <FormContext value={legacyContext}>
      <FormSubmitFooter {...props} />
    </FormContext>
  );
});

SubmitFooter.displayName = 'FormSubmitFooter';

export default SubmitFooter;
