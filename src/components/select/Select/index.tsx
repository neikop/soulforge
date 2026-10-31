import type { CSSProperties, RefAttributes } from 'react'
import type {
  FocusDirection,
  GroupBase,
  InputActionMeta,
  PropsValue,
  SelectComponentsConfig,
  SelectInstance,
  StylesConfig,
} from 'react-select'

import { mergeRefs, useControllableState, useEnvironmentContext, useToken } from '@chakra-ui/react'
import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react'
import ReactSelect, { mergeStyles } from 'react-select'

import type { InternalSelectProps, SelectProps } from './types'

import ClearIndicator from './ClearIndicator'
import DropdownIndicator from './DropdownIndicator'
import Input from './Input'
import Menu from './Menu'
import MenuList from './MenuList'
import MultiValueRemove from './MultiValueRemove'
import OptionComponent from './Option'
import { selectSizeTokens } from './types'
import ValueContainer from './ValueContainer'

export type { SelectOption } from './types'

function getEmptyValue<Option>(isMulti: boolean) {
  return (isMulti ? [] : null) as PropsValue<Option>
}

function getPortalTarget(rootNode: Document | Node | ShadowRoot) {
  if (typeof ShadowRoot !== 'undefined' && rootNode instanceof ShadowRoot) {
    return rootNode as unknown as HTMLElement
  }

  if (typeof Document !== 'undefined' && rootNode instanceof Document) {
    return rootNode.body
  }

  if (rootNode instanceof HTMLElement) {
    return rootNode
  }

  return undefined
}

function SelectComponent<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
  {
    components: customComponents,
    defaultValue,
    inputValue: inputValueProp,
    instanceId,
    isInvalid = false,
    isMulti,
    isSearchable = true,
    menuIsOpen: menuIsOpenProp,
    menuPortalTarget,
    menuPosition = 'absolute',
    onBlur,
    onChange,
    onFocus,
    onInputChange,
    onMenuClose,
    onMenuOpen,
    placeholder,
    searchInputPlacement = 'menu',
    size = 'md',
    styles,
    value,
    ...props
  }: SelectProps<Option, IsMulti, Group>,
  ref: React.ForwardedRef<SelectInstance<Option, IsMulti, Group>>,
) {
  const localRef = useRef<null | SelectInstance<Option, IsMulti, Group>>(null)
  const inputId = useId()
  const { getRootNode } = useEnvironmentContext()
  const currentSizeTokens = selectSizeTokens[size]
  const menuSearchEnabled = Boolean(isSearchable) && searchInputPlacement === 'menu'
  const [fontSize = 'inherit'] = useToken('fontSizes', [currentSizeTokens.fontSizeToken])
  const [lineHeight = 'normal'] = useToken('lineHeights', [currentSizeTokens.lineHeightToken])
  const [controlHeight = 'auto', multiValueHeight = 'auto'] = useToken('sizes', [
    currentSizeTokens.controlHeightToken,
    currentSizeTokens.multiValueHeightToken,
  ])
  const [
    groupHeadingPaddingBottom = '0',
    indicatorPaddingX = '0',
    menuPadding = '0',
    optionPaddingX = '0',
    optionPaddingY = '0',
    valuePaddingX = '0',
    valuePaddingY = '0',
  ] = useToken('spacing', [
    currentSizeTokens.groupHeadingPaddingBottomToken,
    currentSizeTokens.indicatorPaddingXToken,
    currentSizeTokens.menuPaddingToken,
    currentSizeTokens.optionPaddingXToken,
    currentSizeTokens.optionPaddingYToken,
    currentSizeTokens.valuePaddingXToken,
    currentSizeTokens.valuePaddingYToken,
  ])
  const currentSize = useMemo(
    () => ({
      controlHeight,
      groupHeadingPaddingBottom,
      indicatorPaddingX,
      menuPadding,
      multiValueHeight,
      optionPaddingX,
      optionPaddingY,
      valuePaddingX,
      valuePaddingY,
    }),
    [
      controlHeight,
      groupHeadingPaddingBottom,
      indicatorPaddingX,
      menuPadding,
      multiValueHeight,
      optionPaddingX,
      optionPaddingY,
      valuePaddingX,
      valuePaddingY,
    ],
  )

  const tokens = useToken('colors', [
    'bg.canvas',
    'bg.muted',
    'bg.subtle',
    'border.default',
    'error.border',
    'gray.focusRing',
    'fg.subtle',
    'fg.muted',
    'fg.default',
  ])
  const [bgCanvas, bgMuted, bgSubtle, borderDefault, errorBorder, focusRingColor, fgSubtle, fgMuted, fgDefault] = tokens
  const [radiusSm] = useToken('radii', ['sm'])
  const [shadowSm] = useToken('shadows', ['sm'])
  const [fontWeightNormal, fontWeightMid] = useToken('fontWeights', ['normal', 'mid'])
  const [spaceHalf, spaceOne, spaceOneHalf, spaceTwo] = useToken('spacing', ['0.5', '1', '1.5', '2'])

  const [menuFocused, setMenuFocused] = useState(false)
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const resolvedInputValue = inputValueProp ?? uncontrolledInputValue

  const [selectedValue, setSelectedValue] = useControllableState<PropsValue<Option>>({
    defaultValue: defaultValue !== undefined ? defaultValue : getEmptyValue<Option>(Boolean(isMulti)),
    value,
  })

  const closeMenu = useCallback(() => {
    if (menuIsOpenProp === undefined) {
      setMenuFocused(false)
    }
    if (inputValueProp === undefined) {
      setUncontrolledInputValue('')
    }
  }, [inputValueProp, menuIsOpenProp])

  const focusMenuOption = useCallback((direction?: FocusDirection) => {
    localRef.current?.focusOption(direction)
  }, [])

  const selectFocusedOption = useCallback(() => {
    const focusedOption = localRef.current?.state.focusedOption

    if (focusedOption) {
      localRef.current?.selectOption(focusedOption)
    }
  }, [])

  const handleMenuInputChange = useCallback(
    (nextValue: string, actionMeta: InputActionMeta) => {
      const callbackResult = onInputChange?.(nextValue, actionMeta)
      const finalValue = typeof callbackResult === 'string' ? callbackResult : nextValue

      if (inputValueProp === undefined) {
        setUncontrolledInputValue(finalValue)
      }

      return finalValue
    },
    [inputValueProp, onInputChange],
  )

  const internalSelectProps = useMemo(
    () =>
      ({
        __focusMenuOption: focusMenuOption,
        __fontSize: fontSize,
        __lineHeight: lineHeight,
        __menuInputPlaceholder: typeof placeholder === 'string' ? placeholder : undefined,
        __menuInputValue: resolvedInputValue,
        __menuSearchEnabled: menuSearchEnabled,
        __onMenuBlur: closeMenu,
        __onMenuFocus: () => {
          if (menuIsOpenProp === undefined) {
            setMenuFocused(true)
          }
        },
        __onMenuInputChange: handleMenuInputChange,
        __selectFocusedOption: selectFocusedOption,
      }) satisfies Pick<
        InternalSelectProps<Option, IsMulti, Group>,
        | '__focusMenuOption'
        | '__fontSize'
        | '__lineHeight'
        | '__menuInputPlaceholder'
        | '__menuInputValue'
        | '__menuSearchEnabled'
        | '__onMenuBlur'
        | '__onMenuFocus'
        | '__onMenuInputChange'
        | '__selectFocusedOption'
      >,
    [
      closeMenu,
      focusMenuOption,
      fontSize,
      handleMenuInputChange,
      lineHeight,
      menuIsOpenProp,
      menuSearchEnabled,
      placeholder,
      resolvedInputValue,
      selectFocusedOption,
    ],
  )

  const mergedComponents = useMemo<SelectComponentsConfig<Option, IsMulti, Group>>(
    () => ({
      ClearIndicator,
      DropdownIndicator,
      IndicatorSeparator: null,
      ...(menuSearchEnabled ? { Input, Menu, MenuList, ValueContainer } : {}),
      MultiValueRemove,
      Option: OptionComponent,
      ...customComponents,
    }),
    [customComponents, menuSearchEnabled],
  )

  const mergedStyles = useMemo<StylesConfig<Option, IsMulti, Group>>(() => {
    const controlFocusColor = isInvalid ? errorBorder : focusRingColor
    const inlineControlValue = menuSearchEnabled
    const centeredSingleControlValue = !isMulti && !inlineControlValue
    const paddedValueContainer = isMulti || inlineControlValue

    const defaultStyles: StylesConfig<Option, IsMulti, Group> = {
      clearIndicator: (base) => ({
        ...base,
        ':hover': {
          color: fgDefault,
        },
        color: fgSubtle,
        cursor: 'pointer',
        padding: 0,
      }),
      container: (base) => ({
        ...base,
        width: '100%',
      }),
      control: (base, state) => {
        const controlBase = { ...base }
        Reflect.deleteProperty(controlBase, 'outline')

        const isControlActive = !state.isDisabled && (state.isFocused || state.menuIsOpen)
        const idleBorderColor = isInvalid ? errorBorder : borderDefault
        const controlBorderColor = isControlActive ? 'var(--focus-ring-color)' : idleBorderColor

        return {
          ...controlBase,
          '--focus-ring-color': controlFocusColor,
          ':hover': {
            borderColor: controlBorderColor,
          },
          backgroundColor: state.isDisabled ? bgMuted : bgCanvas,
          borderColor: controlBorderColor,
          borderRadius: radiusSm,
          borderStyle: 'solid',
          borderWidth: '1px',
          boxShadow: 'none',
          cursor: state.isDisabled ? 'not-allowed' : 'pointer',
          height: isMulti ? undefined : currentSize.controlHeight,
          minHeight: currentSize.controlHeight,
          outlineColor: isControlActive ? 'var(--focus-ring-color)' : 'transparent',
          outlineOffset: '0px',
          outlineStyle: isControlActive ? ('var(--focus-ring-style, solid)' as CSSProperties['outlineStyle']) : 'none',
          outlineWidth: isControlActive ? 'var(--focus-ring-width, 1px)' : '0px',
          transition:
            'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), outline-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        }
      },
      dropdownIndicator: (base, state) => ({
        ...base,
        ':hover': {
          color: state.isDisabled ? fgSubtle : fgDefault,
        },
        color: state.isDisabled ? fgMuted : fgSubtle,
        padding: 0,
      }),
      groupHeading: (base) => ({
        ...base,
        color: fgSubtle,
        fontSize,
        fontWeight: fontWeightMid,
        marginBottom: 0,
        marginTop: 0,
        paddingBottom: currentSize.groupHeadingPaddingBottom,
        paddingLeft: currentSize.optionPaddingX,
        paddingRight: currentSize.optionPaddingX,
        paddingTop: currentSize.optionPaddingY,
        textTransform: 'none',
      }),
      indicatorsContainer: (base) => ({
        ...base,
        alignItems: 'center',
        alignSelf: 'stretch',
        gap: spaceOne,
        paddingLeft: currentSize.indicatorPaddingX,
        paddingRight: currentSize.indicatorPaddingX,
      }),
      input: (base) => ({
        ...base,
        color: fgDefault,
        display: menuSearchEnabled ? 'inline-grid' : 'flex',
        fontSize,
        lineHeight,
        margin: 0,
        padding: 0,
        ...(menuSearchEnabled
          ? {
              opacity: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              position: 'absolute',
              width: 0,
            }
          : {}),
      }),
      loadingMessage: (base) => ({
        ...base,
        color: fgSubtle,
        padding: `${currentSize.optionPaddingY} ${currentSize.optionPaddingX}`,
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: bgCanvas,
        borderRadius: radiusSm,
        boxShadow: shadowSm,
        marginTop: spaceOne,
        overflow: 'hidden',
        zIndex: 20,
      }),
      menuList: (base) => ({
        ...base,
        padding: menuSearchEnabled ? 0 : currentSize.menuPadding,
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 1500,
      }),
      multiValue: (base) => ({
        ...base,
        alignItems: 'center',
        backgroundColor: bgSubtle,
        borderRadius: radiusSm,
        borderWidth: '1px',
        margin: 0,
        minHeight: currentSize.multiValueHeight,
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: fgDefault,
        fontSize,
        fontWeight: fontWeightMid,
        paddingBottom: 0,
        paddingLeft: spaceTwo,
        paddingRight: spaceHalf,
        paddingTop: 0,
      }),
      multiValueRemove: (base) => ({
        ...base,
        ':hover': {
          backgroundColor: bgMuted,
          color: fgDefault,
        },
        alignItems: 'center',
        borderRadius: radiusSm,
        color: fgSubtle,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: spaceHalf,
        paddingRight: spaceOneHalf,
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: fgSubtle,
        padding: `${currentSize.optionPaddingY} ${currentSize.optionPaddingX}`,
      }),
      option: (base, state) => ({
        ...base,
        ':hover': {
          borderColor: state.isDisabled ? 'transparent' : borderDefault,
        },
        ':active': {
          backgroundColor: bgMuted,
        },
        backgroundColor: state.isSelected ? bgMuted : state.isFocused ? bgSubtle : bgCanvas,
        borderColor: state.isFocused || state.isSelected ? borderDefault : 'transparent',
        borderRadius: radiusSm,
        borderWidth: '1px',
        boxShadow: 'none',
        color: state.isDisabled ? fgMuted : fgDefault,
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        fontSize,
        fontWeight: state.isSelected ? fontWeightMid : fontWeightNormal,
        marginBottom: 0,
        padding: `${currentSize.optionPaddingY} ${currentSize.optionPaddingX}`,
      }),
      placeholder: (base) => ({
        ...base,
        color: fgSubtle,
        fontSize,
        lineHeight,
        margin: 0,
        position: inlineControlValue ? 'static' : centeredSingleControlValue ? 'absolute' : base.position,
        top: centeredSingleControlValue ? '50%' : base.top,
        transform: inlineControlValue ? 'none' : centeredSingleControlValue ? 'translateY(-50%)' : base.transform,
      }),
      singleValue: (base, state) => ({
        ...base,
        color: state.isDisabled ? fgMuted : fgDefault,
        fontSize,
        lineHeight,
        margin: 0,
        maxWidth: '100%',
        position: inlineControlValue ? 'static' : centeredSingleControlValue ? 'absolute' : base.position,
        top: centeredSingleControlValue ? '50%' : base.top,
        transform: inlineControlValue ? 'none' : centeredSingleControlValue ? 'translateY(-50%)' : base.transform,
      }),
      valueContainer: (base) => ({
        ...base,
        alignItems: 'center',
        display: 'flex',
        gap: spaceOne,
        inset: 'auto',
        minHeight: paddedValueContainer ? `calc(${currentSize.controlHeight} - 2px)` : undefined,
        padding: paddedValueContainer
          ? `${currentSize.valuePaddingY} ${currentSize.valuePaddingX}`
          : `0 ${currentSize.valuePaddingX}`,
        position: 'relative',
      }),
    }

    return mergeStyles(defaultStyles, styles ?? {})
  }, [
    currentSize,
    bgCanvas,
    bgMuted,
    bgSubtle,
    borderDefault,
    errorBorder,
    focusRingColor,
    fgSubtle,
    fgMuted,
    fgDefault,
    fontWeightMid,
    fontWeightNormal,
    fontSize,
    isInvalid,
    isMulti,
    lineHeight,
    menuSearchEnabled,
    radiusSm,
    shadowSm,
    spaceHalf,
    spaceOne,
    spaceOneHalf,
    spaceTwo,
    styles,
  ])

  const resolvedMenuPortalTarget = useMemo(() => {
    if (menuPortalTarget !== undefined) {
      return menuPortalTarget
    }

    if (menuPosition !== 'fixed') {
      return undefined
    }

    return getPortalTarget(getRootNode())
  }, [getRootNode, menuPortalTarget, menuPosition])

  const controlledStateProps = useMemo(
    () => ({
      ...(menuSearchEnabled && menuFocused && menuIsOpenProp === undefined ? { menuIsOpen: true } : {}),
      ...(menuIsOpenProp !== undefined ? { menuIsOpen: menuIsOpenProp } : {}),
      ...(menuSearchEnabled || inputValueProp !== undefined ? { inputValue: resolvedInputValue } : {}),
    }),
    [inputValueProp, menuFocused, menuIsOpenProp, menuSearchEnabled, resolvedInputValue],
  )

  return (
    <ReactSelect<Option, IsMulti, Group>
      {...props}
      {...internalSelectProps}
      {...controlledStateProps}
      aria-invalid={isInvalid || undefined}
      classNamePrefix="chakra-select"
      components={mergedComponents}
      instanceId={instanceId ?? inputId}
      isMulti={isMulti}
      isSearchable={isSearchable}
      menuPortalTarget={resolvedMenuPortalTarget}
      menuPosition={menuPosition}
      onBlur={onBlur}
      onChange={(nextValue, actionMeta) => {
        if (menuSearchEnabled && !isMulti) {
          closeMenu()
        }
        setSelectedValue(nextValue as PropsValue<Option>)
        onChange?.(nextValue, actionMeta)
      }}
      onFocus={(event) => {
        if (menuSearchEnabled && menuIsOpenProp === undefined) {
          setMenuFocused(true)
        }
        onFocus?.(event)
      }}
      onInputChange={handleMenuInputChange}
      onMenuClose={onMenuClose}
      onMenuOpen={() => {
        if (menuSearchEnabled && menuIsOpenProp === undefined) {
          setMenuFocused(true)
        }
        onMenuOpen?.()
      }}
      placeholder={placeholder}
      ref={mergeRefs(localRef, ref)}
      styles={mergedStyles}
      unstyled
      value={selectedValue}
    />
  )
}

/**
 * React Select adapter that aligns third-party behavior with shared control geometry and semantic theme tokens.
 *
 * It supports controlled and uncontrolled values, forwards the Select instance ref and keeps menu-search interaction
 * local. Pass normal React Select labelling props such as `inputId`, `name` and `aria-label` from the owning field.
 */
const Select = forwardRef(SelectComponent) as <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: RefAttributes<SelectInstance<Option, IsMulti, Group>> & SelectProps<Option, IsMulti, Group>,
) => React.ReactElement

export default Select
