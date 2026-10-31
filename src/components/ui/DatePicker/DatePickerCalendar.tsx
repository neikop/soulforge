import { DatePicker, Portal, useToken } from '@chakra-ui/react'

/** Shared portalled calendar views for the date and date-range controls. */
const DatePickerCalendar = () => {
  const [primarySolid, primarySolidHover, primaryContrast] = useToken('colors', [
    'primary.solid',
    'primary.solidHover',
    'primary.contrast',
  ])

  return (
    <Portal>
      <DatePicker.Positioner>
        <DatePicker.Content
          css={{
            '& [data-scope="date-picker"][data-part="next-trigger"]:not([data-disabled]), & [data-scope="date-picker"][data-part="prev-trigger"]:not([data-disabled]), & [data-scope="date-picker"][data-part="table-cell-trigger"][data-selectable], & [data-scope="date-picker"][data-part="view-trigger"]:not([data-disabled])':
              { cursor: 'pointer' },
            '& [data-scope="date-picker"][data-part="next-trigger"][data-disabled], & [data-scope="date-picker"][data-part="prev-trigger"][data-disabled], & [data-scope="date-picker"][data-part="table-cell-trigger"][data-disabled], & [data-scope="date-picker"][data-part="view-trigger"][data-disabled]':
              { cursor: 'not-allowed' },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-in-range]': {
              background: 'primary.subtle',
              borderRadius: 0,
              color: 'primary.fg',
            },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-end], & [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-start], & [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-end], & [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-start], & [data-scope="date-picker"][data-part="table-cell-trigger"][data-selected]':
              {
                background: primarySolid,
                color: primaryContrast,
              },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-end]:hover, & [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-start]:hover, & [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-end]:hover, & [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-start]:hover, & [data-scope="date-picker"][data-part="table-cell-trigger"][data-selected]:hover':
              {
                background: primarySolidHover,
              },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-start][data-range-end]': {
              borderRadius: 'l2',
            },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-start]:not([data-range-end])': {
              borderEndRadius: 0,
              borderStartRadius: 'l2',
            },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-range-end]:not([data-range-start])': {
              borderEndRadius: 'l2',
              borderStartRadius: 0,
            },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-start][data-hover-range-end]':
              {
                borderRadius: 'l2',
              },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-start]:not([data-hover-range-end])':
              {
                borderEndRadius: 0,
                borderStartRadius: 'l2',
              },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-hover-range-end]:not([data-hover-range-start])':
              {
                borderEndRadius: 'l2',
                borderStartRadius: 0,
              },
            '& [data-scope="date-picker"][data-part="table-cell-trigger"][data-selected]:not([data-in-range])': {
              borderRadius: 'l2',
            },
          }}
        >
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable />
          </DatePicker.View>
          <DatePicker.View view="month">
            <DatePicker.MonthTable />
          </DatePicker.View>
          <DatePicker.View view="year">
            <DatePicker.YearTable />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </Portal>
  )
}

export default DatePickerCalendar
