const {
  maxProfitOnce,
} = require('../solutions/121-best-time-to-buy-and-sell-stock')

describe('121. 买卖股票的最佳时机（只买卖一次）', () => {
  test('示例 1：[7,1,5,3,6,4] → 第 2 天买、第 5 天卖，收益 5', () => {
    expect(maxProfitOnce([7, 1, 5, 3, 6, 4])).toBe(5)
  })

  test('示例 2：单调递减 → 不交易，收益 0', () => {
    expect(maxProfitOnce([7, 6, 4, 3, 1])).toBe(0)
  })

  test('只有两天且上涨：收益 1', () => {
    expect(maxProfitOnce([1, 2])).toBe(1)
  })

  test('只有两天且下跌：不交易，收益 0', () => {
    expect(maxProfitOnce([2, 1])).toBe(0)
  })

  test('单调递减：[3,2,1] 不交易，收益 0', () => {
    expect(maxProfitOnce([3, 2, 1])).toBe(0)
  })

  test('回归：最低价出现在最后一天不等于收益 0 —— [1,100,0] 应为 99', () => {
    expect(maxProfitOnce([1, 100, 0])).toBe(99)
  })

  test('回归：[7,1,5,4,2,6] 最低价在后段，收益 5', () => {
    expect(maxProfitOnce([7, 1, 5, 4, 2, 6])).toBe(5)
  })

  test('边界：空数组 / null / 单元素都返回 0', () => {
    expect(maxProfitOnce([])).toBe(0)
    expect(maxProfitOnce(null)).toBe(0)
    expect(maxProfitOnce([1])).toBe(0)
  })
})
