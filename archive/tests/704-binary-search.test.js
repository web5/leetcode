const { search } = require('../solutions/704-binary-search')

describe('704. 二分查找', () => {
  test('示例 1：target = 9 → 下标 4', () => {
    expect(search([-1, 0, 3, 5, 9, 12], 9)).toBe(4)
  })

  test('示例 2：target = 2 不存在 → -1', () => {
    expect(search([-1, 0, 3, 5, 9, 12], 2)).toBe(-1)
  })

  test('边界：单元素命中与未命中', () => {
    expect(search([5], 5)).toBe(0)
    expect(search([5], -5)).toBe(-1)
  })

  test('边界：两端元素', () => {
    expect(search([-1, 0, 3, 5, 9, 12], -1)).toBe(0)
    expect(search([-1, 0, 3, 5, 9, 12], 12)).toBe(5)
  })
})
