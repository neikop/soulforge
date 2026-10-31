import { parseDate } from '@chakra-ui/react'

export function formatDateValue(value: string) {
  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

export function parseDateInput(inputValue: string) {
  const normalizedValue = inputValue.trim()

  if (!normalizedValue) {
    return undefined
  }

  const compactValue = normalizedValue.replace(/\D/g, '')

  if (compactValue.length === 8) {
    const day = compactValue.slice(0, 2)
    const month = compactValue.slice(2, 4)
    const year = compactValue.slice(4, 8)

    try {
      return parseDate(`${year}-${month}-${day}`)
    } catch {
      return undefined
    }
  }

  const match = normalizedValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)

  if (!match) {
    return undefined
  }

  const day = match[1]
  const month = match[2]
  const year = match[3]

  if (!day || !month || !year) {
    return undefined
  }

  try {
    return parseDate(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
  } catch {
    return undefined
  }
}

export function formatPartialDateInput(rawValue: string, isDeleting: boolean) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 8)

  if (!digits) {
    return ''
  }

  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  if (isDeleting) {
    if (digits.length <= 2) {
      return day
    }

    if (digits.length <= 4) {
      return `${day}/${month}`
    }

    return `${day}/${month}/${year}`
  }

  if (digits.length < 2) {
    return day
  }

  if (digits.length === 2) {
    return `${day}/`
  }

  if (digits.length < 4) {
    return `${day}/${month}`
  }

  if (digits.length === 4) {
    return `${day}/${month}/`
  }

  return `${day}/${month}/${year}`
}
