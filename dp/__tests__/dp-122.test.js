const { maxProfitInfinite } = require('../dp-122')

describe('LeetCode 122 - 无限次买卖', () => {
  test('常规场景：吃两段上升 (1→5)+(3→6)，收益 7', () => {
    expect(maxProfitInfinite([7, 1, 5, 3, 6, 4])).toBe(7)
  })

  test('单调递增：一路吃到顶，收益 4', () => {
    expect(maxProfitInfinite([1, 2, 3, 4, 5])).toBe(4)
  })

  test('单调递减：不交易，收益 0', () => {
    expect(maxProfitInfinite([7, 6, 4, 3, 1])).toBe(0)
  })

  test('边界：单元素返回 0', () => {
    expect(maxProfitInfinite([1])).toBe(0)
  })
})
