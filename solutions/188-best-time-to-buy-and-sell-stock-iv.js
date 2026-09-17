/**
 * 188. 买卖股票的最佳时机 IV（困难）
 * 题目：problems/dynamic-programming/188-best-time-to-buy-and-sell-stock-iv.md
 *
 * 思路：DP 状态机。buy[j] / sell[j] 表示「已进行 j 笔交易后，当前持股 / 不持股」的最大利润。
 *   sell[j] = max(sell[j],        buy[j] + p)   今天卖出（结束第 j 笔）
 *   buy[j]  = max(buy[j],         sell[j-1] - p) 今天买入（用第 j-1 笔的结余现金开第 j 笔）
 * 每天从 j = 1..k 滚动更新，空间 O(k)。
 *
 * 边界优化：一次完整的买卖至少需要两天，所以最多只能有 floor(n / 2) 笔互不重叠的交易。
 * 当 k >= floor(n / 2) 时，限制形同虚设，直接退化为「122. 无限次买卖」——把所有上升段吃掉。
 * 这一步很关键，否则 k 很大时 DP 会退化成 O(n * k) 且中间状态无意义。
 *
 * 复杂度：时间 O(n * min(k, n/2))，空间 O(k)
 */
function maxProfitIV(k, prices) {
  const n = prices.length
  if (n < 2 || k === 0) return 0

  // 边界优化：k 足够大等价于无限次交易
  if (k >= Math.floor(n / 2)) {
    let profit = 0
    for (let i = 1; i < n; i++) {
      profit += Math.max(0, prices[i] - prices[i - 1])
    }
    return profit
  }

  const buy = new Array(k + 1).fill(-Infinity)
  const sell = new Array(k + 1).fill(0)

  for (const p of prices) {
    for (let j = 1; j <= k; j++) {
      sell[j] = Math.max(sell[j], buy[j] + p) // 保持不持股 vs 今天卖出
      buy[j] = Math.max(buy[j], sell[j - 1] - p) // 保持持股 vs 今天用上一笔的现金买入
    }
  }
  return sell[k]
}

// 仅在直接执行该文件时跑示例，被 jest require 时不打印
if (require.main === module) {
  const prices = [7, 1, 5, 4, 2, 6]
  console.log('res>>>', maxProfitIV(2, prices))
}

module.exports = { maxProfitIV }
