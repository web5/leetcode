const { isPalindrome } = require('../solutions/125-valid-palindrome')

describe('125. 验证回文串', () => {
  test('示例 1：忽略标点与空格后是回文', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true)
  })

  test('示例 2：race a car 不是回文', () => {
    expect(isPalindrome('race a car')).toBe(false)
  })

  test('示例 3：只剩空格 → 空串，是回文', () => {
    expect(isPalindrome(' ')).toBe(true)
  })
})
