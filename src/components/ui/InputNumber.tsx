import { Input, type InputProps } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'

export type InputNumberProps = Omit<NumericFormatProps<InputProps>, 'customInput' | 'getInputRef'>

/**
 * NumericFormat adapter that preserves the shared Chakra Input API and forwards its input ref.
 *
 * Values are non-negative and thousand-separated by default. Consumers own parsing policy through `onValueChange` and
 * should pass accessible field labelling exactly as they would for a native input.
 */
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(props, ref) {
  return <NumericFormat allowNegative={false} customInput={Input} getInputRef={ref} thousandSeparator {...props} />
})

export default InputNumber
