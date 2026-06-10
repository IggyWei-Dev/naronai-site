import { describe, it, expect } from 'vitest'
import { toKobo, fromKobo, toSlug, formatOrderRef } from './utils'

describe('toKobo', () => {
  it('converts naira to kobo', () => {
    expect(toKobo(89000)).toBe(8900000)
  })
  it('rounds fractional kobo', () => {
    expect(toKobo(100.005)).toBe(10001)
  })
})

describe('fromKobo', () => {
  it('converts kobo to naira', () => {
    expect(fromKobo(8900000)).toBe(89000)
  })
})

describe('toSlug', () => {
  it('converts "The Adanna" to "the-adanna"', () => {
    expect(toSlug('The Adanna')).toBe('the-adanna')
  })
  it('removes special characters', () => {
    expect(toSlug('Hello & World!')).toBe('hello-world')
  })
  it('collapses multiple spaces to single dash', () => {
    expect(toSlug('The  Big  Wig')).toBe('the-big-wig')
  })
})

describe('formatOrderRef', () => {
  it('returns first 8 chars uppercased with # prefix', () => {
    expect(formatOrderRef('abc12345-rest-of-uuid')).toBe('#ABC12345')
  })
})
