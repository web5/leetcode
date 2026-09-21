/**
 * 121. 买卖股票的最佳时机（简单）
 * 题目：problems/dynamic-programming/121-best-time-to-buy-and-sell-stock.md
 * 思路：状态压缩 DP。dp[i][0] 不持有 / dp[i][1] 持有，因 dp[i][1] 恒等于 -min(prices[0..i])，
 *       二维坍缩成「维护历史最低买入价 + 当前价 - 最低价更新最大收益」两个标量。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function maxProfitOnce(prices) {
  if (!prices || prices.length < 2) return 0
  // maxProfit 即 dp[i][0]（不持有），minPrice 即 -dp[i][1]（持有）
  let maxProfit = 0
  // 初始化第一天的最低买入价
  let minPrice = prices[0]
  // 一个循环推进「最优不持有」与「最优持有」两个状态
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i]
    // dp[i][0] = max(dp[i-1][0], price - minPrice)：今天不动 或 今天卖出
    maxProfit = Math.max(maxProfit, price - minPrice)
    // dp[i][1] = max(dp[i-1][1], -price)：今天不动 或 今天买入（只能交易一次，买入前收益恒为 0）
    if (price < minPrice) minPrice = price
  }
  // 不能获利时 maxProfit 保持初始值 0
  return maxProfit
}

// 仅在直接 `node 121-best-time-to-buy-and-sell-stock.js` 时执行，被 jest require 时不打印
if (require.main === module) {
  const prices = [7, 1, 5, 4, 2, 6]
  console.log('res>>>', maxProfitOnce(prices))
}

module.exports = { maxProfitOnce }
