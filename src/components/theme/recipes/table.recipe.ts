import { defineSlotRecipe } from '@chakra-ui/react'
import { tableAnatomy } from '@chakra-ui/react/anatomy'

export const tableRecipe = defineSlotRecipe({
  className: 'chakra-table',
  slots: tableAnatomy.keys(),
  base: {
    root: {
      background: 'bg.canvas',
      borderCollapse: 'collapse',
      color: 'fg.default',
      fontVariantNumeric: 'lining-nums tabular-nums',
      textAlign: 'start',
      textStyle: 'body',
      verticalAlign: 'top',
      width: 'full',
    },
    caption: {
      color: 'fg.subtle',
      textStyle: 'meta',
    },
    header: {
      background: 'bg.muted',
    },
    columnHeader: {
      alignItems: 'center',
      color: 'fg.muted',
      textAlign: 'start',
      textStyle: 'meta',
    },
    cell: {
      alignItems: 'center',
      textAlign: 'start',
    },
    footer: {
      background: 'bg.subtle',
      fontWeight: 'mid',
    },
    row: {
      _selected: {
        background: 'primary.subtle',
      },
    },
  },
  variants: {
    interactive: {
      true: {
        body: {
          '& tr:not([data-selected])': {
            _hover: {
              background: 'primary.surface',
            },
          },
        },
      },
    },
    showColumnBorder: {
      true: {
        cell: {
          '&:not(:last-of-type)': {
            borderInlineEndWidth: 1,
          },
        },
        columnHeader: {
          '&:not(:last-of-type)': {
            borderInlineEndWidth: 1,
          },
        },
      },
    },
    stickyHeader: {
      true: {
        header: {
          '& :where(tr)': {
            position: 'sticky',
            top: 'var(--table-sticky-offset, 0)',
            zIndex: 1,
          },
        },
      },
    },
    striped: {
      true: {
        row: {
          '&:nth-of-type(odd) td': {
            background: 'bg.muted',
          },
        },
      },
    },
    variant: {
      line: {
        body: {
          '& > tr': {
            borderBottomWidth: 1,
          },
        },
        columnHeader: {
          borderBottomWidth: 1,
        },
      },
      outline: {
        body: {
          '& > tr:not(:last-of-type)': {
            borderBottomWidth: 1,
          },
        },
        columnHeader: {
          borderBottomWidth: 1,
        },
        footer: {
          borderTopWidth: 1,
        },
        root: {
          borderColor: 'border.default',
          borderWidth: 1,
          boxShadow: 'none',
        },
      },
    },
    size: {
      sm: {
        cell: {
          px: 2,
          py: 2,
        },
        columnHeader: {
          px: 2,
          py: 2,
        },
      },
      md: {
        cell: {
          px: 3,
          py: 3,
        },
        columnHeader: {
          px: 3,
          py: 3,
        },
      },
      lg: {
        cell: {
          px: 4,
          py: 3,
          textStyle: 'fieldLarge',
        },
        columnHeader: {
          px: 4,
          py: 3,
        },
      },
    },
  },
  defaultVariants: {
    interactive: false,
    showColumnBorder: false,
    size: 'md',
    stickyHeader: false,
    striped: false,
    variant: 'outline',
  },
})
