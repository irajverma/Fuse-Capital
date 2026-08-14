import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Serialize a value for embedding in an inline `<script type="application/json">`
// island, escaping `<` so a value containing "</script>" can't break out of the tag.
// Use this at every JSON-island sink so the escaping is structural, not per-site.
export function jsonForScriptTag(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
