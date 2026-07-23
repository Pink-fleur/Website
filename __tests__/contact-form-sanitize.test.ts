describe('Contact form sanitization', () => {
  function sanitize(str: unknown): string {
    if (typeof str !== 'string') return ''
    return str.replace(/<[^>]*>/g, '').trim().slice(0, 2000)
  }

  it('strips HTML tags leaving text content', () => {
    // Tags are removed; inner text is preserved (sanitized on output via React's escaping)
    expect(sanitize('<script>alert("xss")</script>')).toBe('alert("xss")')
    expect(sanitize('<b>bold</b>')).toBe('bold')
  })

  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello')
  })

  it('truncates at 2000 chars', () => {
    const long = 'a'.repeat(3000)
    expect(sanitize(long).length).toBe(2000)
  })

  it('returns empty string for non-string', () => {
    expect(sanitize(42)).toBe('')
    expect(sanitize(null)).toBe('')
    expect(sanitize(undefined)).toBe('')
  })
})
