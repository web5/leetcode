const {
  lengthOfLongestSubstring,
} = require('../solutions/003-longest-substring-without-repeating-characters')

describe('3. 无重复字符的最长子串', () => {
  test('示例 1：abcabcbb → abc，长度 3', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3)
  })

  test('示例 2：bbbbb → b，长度 1', () => {
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1)
  })

  test('示例 3：pwwkew → wke，长度 3（子串不是子序列）', () => {
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3)
  })

  test('边界：空串返回 0', () => {
    expect(lengthOfLongestSubstring('')).toBe(0)
  })
})
