import type { ReactNode } from 'react'

import { Field } from '@chakra-ui/react'

export type FormFieldProps = {
  children: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  htmlFor?: string
  label: ReactNode
  messageId?: string
  required?: boolean
}

/**
 * Label, helper and validation composition for a single form control.
 *
 * Pass `htmlFor` with the child control's `id` when the child does not consume Chakra Field context automatically. Pass
 * `messageId` and the same value through the control's `aria-describedby` when helper or validation copy is present.
 * Validation copy replaces helper copy so the field reserves only one supporting-message region.
 */
const FormField = ({ children, error, helperText, htmlFor, label, messageId, required }: FormFieldProps) => (
  <Field.Root invalid={Boolean(error)} required={required}>
    <Field.Label htmlFor={htmlFor}>
      {label}
      <Field.RequiredIndicator />
    </Field.Label>
    {children}
    {error ? <Field.ErrorText id={messageId}>{error}</Field.ErrorText> : null}
    {!error && helperText ? <Field.HelperText id={messageId}>{helperText}</Field.HelperText> : null}
  </Field.Root>
)

export default FormField
