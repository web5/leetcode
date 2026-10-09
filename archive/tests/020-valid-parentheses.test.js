const { isValid } = require('../solutions/020-valid-parentheses')

describe('20. 有效的括号', () => {
  test('示例 1："()" → true', () => {
    expect(isValid('()')).toBe(true)
  })

  test('示例 2："()[]{}" → true', () => {
    expect(isValid('()[]{}')).toBe(true)
  })

  test('示例 3："(]" 类型不匹配 → false', () => {
    expect(isValid('(]')).toBe(false)
  })

  test('示例 4："([])" → true', () => {
    expect(isValid('([])')).toBe(true)
  })

  test('示例 5："([)]" 交叉 → false', () => {
    expect(isValid('([)]')).toBe(false)
  })

  test('只有左括号 → false', () => {
    expect(isValid('(((')).toBe(false)
  })
})
