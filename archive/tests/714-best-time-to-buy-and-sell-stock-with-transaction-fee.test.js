const {
  maxProfitWithFee,
  maxProfitWithFeeGreedy,
} = require('../solutions/714-best-time-to-buy-and-sell-stock-with-transaction-fee')

describe('714. 买卖股票的最佳时机含手续费', () => {
  test('示例 1：[1,3,2,8,4,9], fee = 2 → 8', () => {
    expect(maxProfitWithFee([1, 3, 2, 8, 4, 9], 2)).toBe(8)
  })

  test('示例 2：[1,3,7,5,10,3], fee = 3 → 6', () => {
    expect(maxProfitWithFee([1, 3, 7, 5, 10, 3], 3)).toBe(6)
  })

  test('fee = 0 时退化为 122（无限次买卖）', () => {
    expect(maxProfitWithFee([7, 1, 5, 3, 6, 4], 0)).toBe(7)
    expect(maxProfitWithFee([7, 1, 5, 4, 2, 6], 0)).toBe(8)
  })

  test('手续费只收一次：[1,10], fee = 3 → 6（不是 9-3-3）', () => {
    expect(maxProfitWithFee([1, 10], 3)).toBe(6)
  })

  test('边界：单元素 / 全相等 / 单调递减 → 0', () => {
    expect(maxProfitWithFee([5], 1)).toBe(0)
    expect(maxProfitWithFee([5, 5, 5], 1)).toBe(0)
    expect(maxProfitWithFee([7, 6, 4, 3, 1], 2)).toBe(0)
  })

  test('边界：手续费大到吃掉全部涨幅 → 0', () => {
    expect(maxProfitWithFee([1, 2, 3], 10)).toBe(0)
  })

  test('连续上涨只做一笔最划算：[1,2,3,4,5], fee = 1 → 3', () => {
    expect(maxProfitWithFee([1, 2, 3, 4, 5], 1)).toBe(3) // (5-1)-1，而不是逐段扣 4 次
  })

  test('回归：示例 1 不能用「逐段上升差分」算（那样得 7）', () => {
    // 逐段差分：1→3(+2)、2→8(+6)、4→9(+5)，各扣一次 fee → 0+4+3 = 7（错）
    // 正解放弃 1→3 那一小段，改从最低点 1 建仓：8
    expect(maxProfitWithFee([1, 3, 2, 8, 4, 9], 2)).toBe(8)
    expect(maxProfitWithFeeGreedy([1, 3, 2, 8, 4, 9], 2)).toBe(8)
  })

  test('贪心版与 DP 版结果一致（随机对照）', () => {
    let seed = 714
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed / 2147483648
    }

    for (let round = 0; round < 200; round++) {
      const len = 1 + Math.floor(rand() * 30)
      const prices = Array.from({ length: len }, () => 1 + Math.floor(rand() * 40))
      const fee = Math.floor(rand() * 6)
      const dp = maxProfitWithFee(prices, fee)
      const greedy = maxProfitWithFeeGreedy(prices, fee)
      expect([fee, greedy]).toEqual([fee, dp])
      expect(dp).toBeGreaterThanOrEqual(0)
    }
  })

  test('贪心版专项：fee = 0 时等于所有正差分之和', () => {
    const prices = [7, 1, 5, 3, 6, 4]
    let expected = 0
    for (let i = 1; i < prices.length; i++) expected += Math.max(0, prices[i] - prices[i - 1])
    expect(maxProfitWithFeeGreedy(prices, 0)).toBe(expected)
  })
})
