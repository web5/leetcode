const { containsDuplicate } = require('../solutions/217-contains-duplicate')

describe('217. 存在重复元素', () => {
  test('示例 1：元素 1 在下标 0 和 3 出现', () => {
    expect(containsDuplicate([1, 2, 3, 1])).toBe(true)
  })

  test('示例 2：所有元素都不同', () => {
    expect(containsDuplicate([1, 2, 3, 4])).toBe(false)
  })

  test('示例 3：多个重复值', () => {
    expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true)
  })
})
