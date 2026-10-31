import type {
  ActionMeta,
  FocusDirection,
  GroupBase,
  InputActionMeta,
  OnChangeValue,
  PropsValue,
  Props as ReactSelectProps,
  SelectComponentsConfig,
  StylesConfig,
} from 'react-select'

export type SelectOption = {
  label: string
  value: string
}

export type SelectSize = 'lg' | 'md' | 'sm'

type SelectSizeTokens = {
  controlHeightToken: 'control.lg' | 'control.md' | 'control.sm'
  fontSizeToken: 'md' | 'sm'
  groupHeadingPaddingBottomToken: '1' | '1.5'
  indicatorPaddingXToken: '2.5' | '3' | '3.5'
  lineHeightToken: 'body' | 'title'
  menuPaddingToken: '1' | '1.5'
  multiValueHeightToken: 'controlTag.lg' | 'controlTag.md' | 'controlTag.sm'
  optionPaddingXToken: '1.5' | '2' | '3'
  optionPaddingYToken: '1' | '1.5' | '2'
  valuePaddingXToken: '2.5' | '3' | '3.5'
  valuePaddingYToken: '0.5' | '1'
}

export const selectSizeTokens: Record<SelectSize, SelectSizeTokens> = {
  lg: {
    controlHeightToken: 'control.lg',
    fontSizeToken: 'md',
    groupHeadingPaddingBottomToken: '1.5',
    indicatorPaddingXToken: '3.5',
    lineHeightToken: 'title',
    menuPaddingToken: '1.5',
    multiValueHeightToken: 'controlTag.lg',
    optionPaddingXToken: '3',
    optionPaddingYToken: '2',
    valuePaddingXToken: '3.5',
    valuePaddingYToken: '1',
  },
  md: {
    controlHeightToken: 'control.md',
    fontSizeToken: 'sm',
    groupHeadingPaddingBottomToken: '1',
    indicatorPaddingXToken: '3',
    lineHeightToken: 'body',
    menuPaddingToken: '1',
    multiValueHeightToken: 'controlTag.md',
    optionPaddingXToken: '2',
    optionPaddingYToken: '1.5',
    valuePaddingXToken: '3',
    valuePaddingYToken: '0.5',
  },
  sm: {
    controlHeightToken: 'control.sm',
    fontSizeToken: 'sm',
    groupHeadingPaddingBottomToken: '1',
    indicatorPaddingXToken: '2.5',
    lineHeightToken: 'body',
    menuPaddingToken: '1',
    multiValueHeightToken: 'controlTag.sm',
    optionPaddingXToken: '1.5',
    optionPaddingYToken: '1',
    valuePaddingXToken: '2.5',
    valuePaddingYToken: '0.5',
  },
}

export type InternalSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = {
  __focusMenuOption: (direction?: FocusDirection) => void
  __fontSize: string
  __lineHeight: string
  __menuInputPlaceholder?: string
  __menuInputValue: string
  __menuSearchEnabled: boolean
  __onMenuBlur: () => void
  __onMenuFocus: () => void
  __onMenuInputChange: (nextValue: string, actionMeta: InputActionMeta) => string
  __selectFocusedOption: () => void
} & SelectProps<Option, IsMulti, Group>

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = {
  components?: SelectComponentsConfig<Option, IsMulti, Group>
  defaultValue?: PropsValue<Option>
  isInvalid?: boolean
  menuPortalTarget?: HTMLElement | null
  onChange?: (value: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void
  searchInputPlacement?: 'control' | 'menu'
  size?: SelectSize
  styles?: StylesConfig<Option, IsMulti, Group>
  value?: PropsValue<Option>
} & Omit<
  ReactSelectProps<Option, IsMulti, Group>,
  'components' | 'defaultValue' | 'menuPortalTarget' | 'onChange' | 'size' | 'styles' | 'theme' | 'unstyled' | 'value'
>
