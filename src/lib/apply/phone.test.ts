import { describe, expect, it } from 'vitest'
import { formatUsPhone, isValidUsPhone, nationalUsDigits } from './phone'

// Regression coverage for the "please enter a valid US phone number" bug on re-apply:
// validation used /^[2-9]\d{9}$/ (real NANP: area codes can't start with 0 or 1), which
// rejected demo placeholder numbers like (023) 023-0232. Users type plain 10-digit
// numbers, so any 10 digits must pass, and typing a number that starts with 1 must not
// trigger the country-code strip (that would eat the first keystroke).

describe('nationalUsDigits', () => {
  it('strips formatting from a plain national number', () => {
    expect(nationalUsDigits('(555) 123-4567')).toBe('5551234567')
    expect(nationalUsDigits('555-123-4567')).toBe('5551234567')
  })

  it('strips the country code only from a full 11-digit "1..." string', () => {
    expect(nationalUsDigits('+1 (555) 123-4567')).toBe('5551234567')
    expect(nationalUsDigits('15551234567')).toBe('5551234567')
  })

  it('never strips a leading 1 from a partial or 10-digit entry (typed keystrokes)', () => {
    expect(nationalUsDigits('1')).toBe('1')
    expect(nationalUsDigits('1231231234')).toBe('1231231234')
  })
})

describe('isValidUsPhone', () => {
  it('accepts any 10-digit number, including demo placeholders starting with 0 or 1', () => {
    expect(isValidUsPhone('(555) 123-4567')).toBe(true)
    expect(isValidUsPhone('(023) 023-0232')).toBe(true)
    expect(isValidUsPhone('1231231234')).toBe(true)
    expect(isValidUsPhone('0230230232')).toBe(true)
  })

  it('accepts a pasted number with the +1 country code', () => {
    expect(isValidUsPhone('+1 (555) 123-4567')).toBe(true)
    expect(isValidUsPhone('15551234567')).toBe(true)
  })

  it('rejects wrong lengths', () => {
    expect(isValidUsPhone('')).toBe(false)
    expect(isValidUsPhone('555123456')).toBe(false)
    expect(isValidUsPhone('05551234567')).toBe(false)
  })
})

describe('formatUsPhone', () => {
  it('formats progressively as the user types', () => {
    expect(formatUsPhone('5')).toBe('(5')
    expect(formatUsPhone('5551')).toBe('(555) 1')
    expect(formatUsPhone('5551234567')).toBe('(555) 123-4567')
  })

  it('keeps a typed leading 1 (only a full 11-digit paste is treated as +1)', () => {
    expect(formatUsPhone('1')).toBe('(1')
    expect(formatUsPhone('1231231234')).toBe('(123) 123-1234')
    expect(formatUsPhone('15551234567')).toBe('(555) 123-4567')
  })

  it('caps at 10 national digits', () => {
    expect(formatUsPhone('02345678901')).toBe('(023) 456-7890')
  })
})
