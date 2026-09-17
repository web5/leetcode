const {
  maxProfitII,
} = require('../solutions/122-best-time-to-buy-and-sell-stock-ii')

describe('122. 买卖股票的最佳时机 II（无限次买卖）', () => {
  test('示例 1：[7,1,5,3,6,4] → 吃两段上升 (1→5)+(3→6)，收益 7', () => {
    expect(maxProfitII([7, 1, 5, 3, 6, 4])).toBe(7)
  })

  test('示例 2：单调递增 → 一路吃到顶，收益 4', () => {
    expect(maxProfitII([1, 2, 3, 4, 5])).toBe(4)
  })

  test('示例 3：单调递减 → 不交易，收益 0', () => {
    expect(maxProfitII([7, 6, 4, 3, 1])).toBe(0)
  })

  test('边界：单元素返回 0', () => {
    expect(maxProfitII([1])).toBe(0)
  })
})
