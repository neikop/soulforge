import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import {
  DatePickerInput,
  DateRangePickerInput,
  type DateRangeValue,
  DateTimePickerInput,
  type DateTimeValue,
  FormField,
} from 'components/ui'
import { useMemo, useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

export function DatePickerSection() {
  const [selectedDate, setSelectedDate] = useState('2026-04-07')
  const [smallDate, setSmallDate] = useState('')
  const [mediumDate, setMediumDate] = useState('2026-04-12')
  const [dateRange, setDateRange] = useState<DateRangeValue>(['2026-04-07', '2026-04-14'])
  const [dateTime, setDateTime] = useState<DateTimeValue>({ date: '2026-04-07', time: '14:30' })

  const formattedDate = useMemo(() => {
    if (!selectedDate) {
      return 'No date selected'
    }

    const [year, month, day] = selectedDate.split('-')

    if (!year || !month || !day) {
      return selectedDate
    }

    return `${day}/${month}/${year}`
  }, [selectedDate])

  return (
    <Stack gap={5} id="date-picker" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Date Picker"
        subtitle="Use the shared Chakra Date Picker wrapper instead of native date inputs so forms keep the same interaction pattern and surface styling."
        title="Date inputs should feel like the rest of the system."
      />

      <DocsCard title="Preview">
        <Stack gap={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField htmlFor="guide-date-controlled" label="Controlled">
              <DatePickerInput
                id="guide-date-controlled"
                onChange={setSelectedDate}
                placeholder="dd/mm/yyyy"
                value={selectedDate}
              />
              <Text color="fg.subtle" textStyle="body">
                {formattedDate}
              </Text>
            </FormField>

            <Stack gap={3}>
              <FormField htmlFor="guide-date-small" label="Small">
                <DatePickerInput
                  id="guide-date-small"
                  onChange={setSmallDate}
                  placeholder="dd/mm/yyyy"
                  size="sm"
                  value={smallDate}
                />
              </FormField>
              <FormField htmlFor="guide-date-medium" label="Medium">
                <DatePickerInput
                  id="guide-date-medium"
                  onChange={setMediumDate}
                  placeholder="dd/mm/yyyy"
                  size="md"
                  value={mediumDate}
                />
              </FormField>
              <FormField htmlFor="guide-date-large" label="Large">
                <DatePickerInput defaultValue="2026-04-18" id="guide-date-large" placeholder="dd/mm/yyyy" size="lg" />
              </FormField>
            </Stack>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
            <FormField htmlFor="guide-date-disabled" label="Disabled">
              <DatePickerInput disabled id="guide-date-disabled" value="2026-04-08" />
            </FormField>

            <FormField htmlFor="guide-date-readonly" label="Read only">
              <DatePickerInput id="guide-date-readonly" readOnly value="2026-04-09" />
            </FormField>

            <FormField
              error="Choose an available date."
              htmlFor="guide-date-invalid"
              label="Invalid"
              messageId="guide-date-invalid-message"
            >
              <DatePickerInput aria-describedby="guide-date-invalid-message" id="guide-date-invalid" invalid value="" />
            </FormField>

            <FormField htmlFor="guide-date-required" label="Required" required>
              <DatePickerInput id="guide-date-required" name="startDate" required />
            </FormField>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>
            <FormField label="Date range">
              <DateRangePickerInput onChange={setDateRange} value={dateRange} />
              <Text color="fg.subtle" textStyle="body">
                {dateRange.filter(Boolean).join(' – ') || 'No range selected'}
              </Text>
            </FormField>

            <FormField label="Local date and time">
              <DateTimePickerInput onChange={setDateTime} value={dateTime} />
              <Text color="fg.subtle" textStyle="body">
                {dateTime.date && dateTime.time ? `${dateTime.date}T${dateTime.time}` : 'Incomplete date-time'}
              </Text>
            </FormField>

            <FormField error="Enter both a valid date and time." label="Invalid local date and time">
              <DateTimePickerInput defaultValue={{ date: '2026-04-07', time: '' }} invalid />
            </FormField>
          </SimpleGrid>
        </Stack>
      </DocsCard>
    </Stack>
  )
}
