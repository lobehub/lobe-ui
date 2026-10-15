'use client';

import { memo, useMemo } from 'react';

import FormSubmitFooter from '../Form/components/FormSubmitFooter';
import { FormContext } from '../Form/context';
import type { FormSubmitFooterProps } from '../Form/type';
import { useFormKitContext } from './context';
import { getInternals } from './instance';
import { useStoreSelector } from './useStoreSelector';

const SubmitFooter = memo<FormSubmitFooterProps>((props) => {
  const { form, layout, variant } = useFormKitContext();
  const { engine } = getInternals(form);
  const status = useStoreSelector(engine, (e) => e.getStatus());

  const legacyContext = useMemo(
    () => ({
      hasUnsavedChanges: status.dirty,
      layout,
      requestReset: () => form.reset(),
      submitLoading: status.submitting,
      variant,
    }),
    [form, layout, status.dirty, status.submitting, variant],
  );

  return (
    <FormContext value={legacyContext}>
      <FormSubmitFooter {...props} />
    </FormContext>
  );
});

SubmitFooter.displayName = 'FormSubmitFooter';

export default SubmitFooter;
