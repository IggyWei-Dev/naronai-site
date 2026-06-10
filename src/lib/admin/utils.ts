export function toKobo(naira: number): number {
  return Math.round(naira * 100)
}

export function fromKobo(kobo: number): number {
  return kobo / 100
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatOrderRef(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`
}
