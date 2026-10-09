/**
 * 714. 买卖股票的最佳时机含手续费（中等）
 * 题目：problems/dynamic-programming/714-best-time-to-buy-and-sell-stock-with-transaction-fee.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 族谱：122（无限笔）+ 手续费，挂在 dp/README.md §10.5.6 的「交易成本维」。
 *
 * 思路：DP 状态机，在 122 上只多一处 —— 卖出时扣一次手续费。
 *   hold = max(hold, cash - p)         // 今天买入（手续费在卖出时扣，这里不扣）
 *   cash = max(cash, hold + p - fee)   // 今天卖出，扣一次 fee
 *
 * 更新顺序有讲究：先更新 hold 再更新 cash。
 *   hold 用的是「昨天的 cash」；若反过来先用今天的 cash 去买入，等于同一天卖了又买，
 *   虽然此时只会白付一次手续费、不会算出更优解，但顺序写对才讲得清。
 *
 * 贪心对照（122 的差分贪心在此失效）：
 *   122 把每天正差分全加起来即可；含手续费时改用「含手续费的最低买入成本」：
 *   卖出时 profit += p - minPrice - fee，并把 minPrice 抬到 p - fee（避免后续上涨被二次收费）。
 *
 * 复杂度：时间 O(n)，空间 O(1)（两种解法一致）
 */

// 主解：DP 状态机（更能平滑迁移到 188 / 309 / 123）
function maxProfitWithFee(prices, fee) {
  let hold = -Infinity // 持股状态的最大利润
  let cash = 0 // 空仓状态的最大利润

  for (const p of prices) {
    hold = Math.max(hold, cash - p) // 买入：手续费在卖出时扣，这里不扣
    cash = Math.max(cash, hold + p - fee) // 卖出：一次完整交易只收一次 fee
  }

  return cash
}

// 贪心：维护含手续费的最低买入成本（O(1) 空间，常数更小）
function maxProfitWithFeeGreedy(prices, fee) {
  let minPrice = prices[0] // 视为已持有，成本为 prices[0]（fee 在卖出时扣）
  let profit = 0

  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]
    if (p < minPrice) {
      minPrice = p // 出现更低点 → 换成在这里建仓
    } else if (p > minPrice + fee) {
      profit += p - minPrice - fee
      // 关键一行：把买入成本抬到「本次卖出价 - fee」。
      // 这样价格继续上涨时不会重新收一次手续费（相当于同一笔交易继续持有）。
      minPrice = p - fee
    }
  }

  return profit
}

module.exports = { maxProfitWithFee, maxProfitWithFeeGreedy }

if (require.main === module) {
  console.log('res>>>', maxProfitWithFee([1, 3, 2, 8, 4, 9], 2)) // 8
  console.log('res>>>', maxProfitWithFeeGreedy([1, 3, 2, 8, 4, 9], 2)) // 8
  console.log('res>>>', maxProfitWithFee([1, 3, 7, 5, 10, 3], 3)) // 6
}
