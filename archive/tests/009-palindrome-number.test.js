const {
  isPalindromeNumber,
} = require('../solutions/009-palindrome-number')

describe('9. 回文数', () => {
  test('示例 1：121 → true', () => {
    expect(isPalindromeNumber(121)).toBe(true)
  })

  test('示例 2：-121 → false（负数不是回文）', () => {
    expect(isPalindromeNumber(-121)).toBe(false)
  })

  test('示例 3：10 → false（末位为 0）', () => {
    expect(isPalindromeNumber(10)).toBe(false)
  })

  test('奇数位：12321 → true，偶数位：1221 → true', () => {
    expect(isPalindromeNumber(12321)).toBe(true)
    expect(isPalindromeNumber(1221)).toBe(true)
  })

  test('边界：0 → true，单个非零数字 → true', () => {
    expect(isPalindromeNumber(0)).toBe(true)
    expect(isPalindromeNumber(7)).toBe(true)
  })
})
