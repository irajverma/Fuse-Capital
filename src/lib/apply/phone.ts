// US-only (NANP) phone helpers shared by the apply flow, the settings page, and the
// server-side DraftSchema. The UI renders the national number as (XXX) XXX-XXXX with
// the "+1" in an input addon, and must accept paste/autocomplete that includes the
// +1 country code.

// The 10 national digits, with a leading 1 country code stripped so paste/autocomplete
// with "+1" works. The strip is gated on an exact 11-digit length on purpose: users
// type plain 10-digit numbers (sometimes starting with 1), and an eager strip would
// eat that first keystroke. Only a full 11-digit string is unambiguously "1" + number.
export function nationalUsDigits(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1)
  return d
}

// Any 10 digits. Deliberately looser than real NANP rules (area code 2-9 etc.):
// applicants at the demo stage enter placeholder numbers like (023) 023-0232, and
// rejecting those reads as a bug. Tighten to NANP if phone verification goes live.
export function isValidUsPhone(raw: string): boolean {
  return /^\d{10}$/.test(nationalUsDigits(raw))
}

// Format the national number as (XXX) XXX-XXXX; partial input formats progressively as
// the user types.
export function formatUsPhone(raw: string): string {
  const d = nationalUsDigits(raw).slice(0, 10)
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  if (d.length > 0) return `(${d}`
  return ''
}
