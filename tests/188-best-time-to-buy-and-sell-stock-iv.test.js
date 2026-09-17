const {
  maxProfitIV,
} = require('../solutions/188-best-time-to-buy-and-sell-stock-iv')

describe('188. 买卖股票的最佳时机 IV', () => {
  test('示例 1：k = 2, [2,4,1] → 2', () => {
    expect(maxProfitIV(2, [2, 4, 1])).toBe(2)
  })

  test('示例 2：k = 2, [3,2,6,5,0,3] → 7（两笔：2→6、0→3）', () => {
    expect(maxProfitIV(2, [3, 2, 6, 5, 0, 3])).toBe(7)
  })

  test('k = 0 不能交易 → 0', () => {
    expect(maxProfitIV(0, [1, 2, 3])).toBe(0)
  })

  test('k = 1：退化为 121 只买卖一次', () => {
    expect(maxProfitIV(1, [7, 1, 5, 3, 6, 4])).toBe(5)
  })

  test('k 很大：退化为 122 无限次买卖', () => {
    expect(maxProfitIV(10, [7, 1, 5, 3, 6, 4])).toBe(7)
    expect(maxProfitIV(100, [7, 1, 5, 4, 2, 6])).toBe(8)
  })

  test('单调递减：不交易 → 0', () => {
    expect(maxProfitIV(2, [7, 6, 4, 3, 1])).toBe(0)
  })
})
