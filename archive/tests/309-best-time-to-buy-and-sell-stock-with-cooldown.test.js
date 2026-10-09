const {
  maxProfitWithCooldown,
  maxProfitWithCooldownBruteForce,
} = require('../solutions/309-best-time-to-buy-and-sell-stock-with-cooldown')

describe('309. 最佳买卖股票时机含冷冻期', () => {
  test('示例 1：[7,1,5,3,6,4] → 5（买 1 卖 6）', () => {
    expect(maxProfitWithCooldown([7, 1, 5, 3, 6, 4])).toBe(5)
  })

  test('示例 2：[1,2,3,0,2] → 3（两笔 + 冷冻一天）', () => {
    expect(maxProfitWithCooldown([1, 2, 3, 0, 2])).toBe(3)
  })

  test('冷冻期确实生效：[1,4,2,7] → 6（122 会给出 8）', () => {
    // 122：买 1 卖 4（+3）、买 2 卖 7（+5）= 8
    // 309：卖在 4 之后第 3 天（价格 2）处于冷冻，买不回来；只能一次买 1 卖 7 = 6
    expect(maxProfitWithCooldown([1, 4, 2, 7])).toBe(6)
  })

  test('同一数组与 122 的差距就是冷冻期的代价', () => {
    const prices = [7, 1, 5, 3, 6, 4]
    // 122（无冷冻）逐段吃满：(-6) + 4 + (-2) + 3 + (-2) 的正差分 = 7
    let noCooldown = 0
    for (let i = 1; i < prices.length; i++) noCooldown += Math.max(0, prices[i] - prices[i - 1])
    expect(noCooldown).toBe(7)
    expect(maxProfitWithCooldown(prices)).toBe(5)
  })

  test('边界：空数组 / 单元素 / 两元素上涨 / 单调递减 / 全相等', () => {
    expect(maxProfitWithCooldown([])).toBe(0)
    expect(maxProfitWithCooldown([5])).toBe(0)
    expect(maxProfitWithCooldown([1, 2])).toBe(1)
    expect(maxProfitWithCooldown([3, 2, 1])).toBe(0)
    expect(maxProfitWithCooldown([4, 4, 4])).toBe(0)
  })

  test('连续上涨只做一笔：[1,2,3,4,5] → 4（卖了要停一天，拆开没有更多收益）', () => {
    expect(maxProfitWithCooldown([1, 2, 3, 4, 5])).toBe(4)
  })

  test('结果永不为负', () => {
    const cases = [[7, 6, 4, 3, 1], [9, 1, 8, 2, 7], [1], [], [5, 5]]
    for (const prices of cases) {
      expect(maxProfitWithCooldown(prices)).toBeGreaterThanOrEqual(0)
    }
  })

  test('与记忆化暴力搜索对照（随机小数组）', () => {
    let seed = 309
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed / 2147483648
    }

    for (let round = 0; round < 300; round++) {
      const len = Math.floor(rand() * 9) // 0..8，暴力搜索跑得动
      const prices = Array.from({ length: len }, () => Math.floor(rand() * 13))
      const dp = maxProfitWithCooldown(prices)
      const brute = maxProfitWithCooldownBruteForce(prices)
      expect([prices.join(','), dp]).toEqual([prices.join(','), brute])
    }
  })

  test('踩坑回归：状态更新用「上一天的 sold」，否则冷冻期失效', () => {
    // 错误写法（rest 用今天刚更新的 sold）等价于没有冷冻期，会算出 8
    const buggy = (prices) => {
      let hold = -prices[0]
      let sold = 0
      let rest = 0
      for (let i = 1; i < prices.length; i++) {
        const p = prices[i]
        hold = Math.max(hold, rest - p)
        sold = hold + p // 故意用「今天刚更新的 hold」+ 下面用「今天刚更新的 sold」
        rest = Math.max(rest, sold)
      }
      return Math.max(sold, rest)
    }
    expect(maxProfitWithCooldown([1, 4, 2, 7])).toBe(6)
    expect(buggy([1, 4, 2, 7])).toBe(8) // 时间边界写错 → 冷冻期失效，退化成 122 的答案
  })
})
