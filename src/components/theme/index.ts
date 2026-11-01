import { createSystem, defaultConfig, defineConfig, defineTextStyles, type SystemConfig } from '@chakra-ui/react'

import { layerStyles } from './layerStyles'
import { matrixTextStyles } from './matrixTokens'
import {
  alertRecipe,
  buttonRecipe,
  checkboxRecipe,
  datePickerRecipe,
  dialogRecipe,
  drawerRecipe,
  emptyStateRecipe,
  fieldRecipe,
  inputRecipe,
  linkRecipe,
  radioGroupRecipe,
  tableRecipe,
  tabsRecipe,
} from './recipes'
import { semanticTokens } from './semanticTokens'

const textStyles = defineTextStyles({
  ...matrixTextStyles,
  action: { value: { fontSize: 'sm', fontWeight: 'mid', lineHeight: 'body' } },
  actionCompact: { value: { fontSize: 'xs', fontWeight: 'mid', lineHeight: 'meta' } },
  actionLarge: { value: { fontSize: 'md', fontWeight: 'mid', lineHeight: 'title' } },
  body: { value: { fontSize: 'sm', fontWeight: 'normal', lineHeight: 'body' } },
  bodyCompact: { value: { fontSize: 'xs', fontWeight: 'normal', lineHeight: 'meta' } },
  bodyLarge: { value: { fontSize: 'md', fontWeight: 'normal', lineHeight: 'title' } },
  display: {
    value: {
      fontSize: { base: '3xl', md: '5xl' },
      fontWeight: 'bold',
      letterSpacing: '-0.04em',
      lineHeight: { base: 'display', md: 'displayWide' },
    },
  },
  meta: {
    value: {
      fontSize: 'xs',
      fontWeight: 'mid',
      letterSpacing: '0.08em',
      lineHeight: 'meta',
      textTransform: 'uppercase',
    },
  },
  field: { value: { fontSize: 'sm', fontWeight: 'normal', lineHeight: 'body' } },
  fieldLarge: { value: { fontSize: 'md', fontWeight: 'normal', lineHeight: 'title' } },
  sectionTitle: {
    value: {
      fontSize: { base: '2xl', md: '3xl' },
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: { base: 'sectionTitle', md: 'sectionTitleWide' },
    },
  },
  title: {
    value: {
      fontSize: 'md',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: 'title',
    },
  },
  titleCompact: {
    value: {
      fontSize: 'sm',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: 'body',
    },
  },
  titleLarge: {
    value: {
      fontSize: 'xl',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: 'titleLarge',
    },
  },
})

const theme: SystemConfig = {
  theme: {
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      link: linkRecipe,
    },
    slotRecipes: {
      alert: alertRecipe,
      checkbox: checkboxRecipe,
      datePicker: datePickerRecipe,
      dialog: dialogRecipe,
      drawer: drawerRecipe,
      emptyState: emptyStateRecipe,
      field: fieldRecipe,
      radioGroup: radioGroupRecipe,
      table: tableRecipe,
      tabs: tabsRecipe,
    },
    layerStyles,
    semanticTokens,
    textStyles,
    tokens: {
      fonts: {
        body: { value: '"Segoe UI Variable Text", "Segoe UI", Inter, ui-sans-serif, system-ui, sans-serif' },
        heading: { value: '{fonts.body}' },
      },
      fontWeights: {
        bold: { value: '700' },
        medium: { value: '{fontWeights.mid}' },
        mid: { value: '600' },
        normal: { value: '400' },
        semibold: { value: '{fontWeights.mid}' },
      },
      lineHeights: {
        body: { value: '1.25rem' },
        display: { value: '2.25rem' },
        displayWide: { value: '3.5rem' },
        meta: { value: '1rem' },
        sectionTitle: { value: '2rem' },
        sectionTitleWide: { value: '2.25rem' },
        title: { value: '1.5rem' },
        titleLarge: { value: '1.75rem' },
      },
      radii: {
        sm: { value: '8px' },
        md: { value: '12px' },
        lg: { value: '16px' },
        xl: { value: '20px' },
      },
      sizes: {
        workspace: { value: '1600px' },
        matrix: { value: '1180px' },
        matrixSlot: { value: '128px' },
        control: {
          lg: { value: '{sizes.10}' },
          md: { value: '{sizes.9}' },
          sm: { value: '{sizes.8}' },
          xs: { value: '{sizes.7}' },
        },
        controlTag: {
          lg: { value: '1.875rem' },
          md: { value: '1.75rem' },
          sm: { value: '1.625rem' },
        },
      },
    },
  },
}

const config = defineConfig({
  globalCss: {
    '*, *::before, *::after': { borderColor: 'border.default', borderStyle: 'solid' },
    body: { background: 'bg.page', color: 'fg.default', colorPalette: 'primary' },
    html: { '&.dark': { colorScheme: 'dark' }, colorScheme: 'light' },
  },
  ...theme,
})

export const system = createSystem(defaultConfig, config)
