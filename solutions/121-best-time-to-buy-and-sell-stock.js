/**
 * 121. 买卖股票的最佳时机（简单）
 * 题目：problems/dynamic-programming/121-best-time-to-buy-and-sell-stock.md
 * 思路：一次遍历，贪心/DP——一边更新「历史最低买入价」，一边用当前价 - 最低价更新最大收益。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function maxProfitOnce(prices) {
  if (!prices || prices.length < 2) return 0
  let maxProfit = 0
  // 初始化第一个下标为最小值下标和最小值
  let minPrice = prices[0]
  let minIndex = 0
  // 一个循环计算最大收益、最小买入价格、最小下标
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i]
    // 贪心算法，动态计算最小值和下标
    if (price < minPrice) {
      minPrice = price
      minIndex = i
    }
    const profit = price - minPrice
    maxProfit = Math.max(maxProfit, profit)
  }
  // 如果最小价格是最后一个价格，则没有卖出，收益是 0
  if (minIndex === prices.length - 1) return 0
  return maxProfit
}

// 仅在直接 `node 121-best-time-to-buy-and-sell-stock.js` 时执行，被 jest require 时不打印
if (require.main === module) {
  const prices = [7, 1, 5, 4, 2, 6]
  console.log('res>>>', maxProfitOnce(prices))
}

module.exports = { maxProfitOnce }
