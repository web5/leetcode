/**
 * 121. 买卖股票的最佳时机（简单）
 * https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
 * 标签：数组、动态规划
 *
 * 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 * 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。
 * 设计一个算法来计算你所能获取的最大利润。
 * 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
 *
 * 示例 1：
 *   输入：[7,1,5,3,6,4]
 *   输出：5
 *   解释：在第 2 天（股票价格 = 1）买入，在第 5 天（股票价格 = 6）卖出，最大利润 = 6-1 = 5。
 *        注意利润不能是 7-1 = 6，因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
 *
 * 示例 2：
 *   输入：[7,6,4,3,1]
 *   输出：0
 *   解释：在这种情况下，没有交易完成，所以最大利润为 0。
 *
 * 提示：
 *   1 <= prices.length <= 10^5
 *   0 <= prices[i] <= 10^4
 */

const prices = [7, 1, 5, 4, 2, 6]
// const prices = [7, 8, 5, 4, 2, 1]
function maxProfitOnce(prices) {
  if (!prices || prices.length < 2) return 0
  let maxProfit = 0
  // 初始化第一个下标为最小值下标和最小值
  let minPrice = prices[0]
  let minIndex = 0
  // 一个循环计算最大收益、最小买入价格、最小下标
  for (let i = 0; i < prices.length; i++) {
    const  price = prices[i]
    // 贪心算法，动态计算最小值和下标
     if(prices[i] < minPrice) {
        minPrice = prices[i]
        minIndex = i
    }
    minPrice = Math.min(minPrice, price)
    const profit = price - minPrice;
    maxProfit = Math.max(maxProfit, profit)
  }
  // 如果最小价格是最后一个价格，则没有卖出，收益是 0
  if(minIndex === prices.length - 1) return 0
  return maxProfit
}

// function maxProfit(prices) {
//   let maxProfit = 0
//   let min = prices[0]
//   let minIndex = 0
//   for (let i = 0; i < prices.length; i++) {
//    if(prices[i] < min) {
//     min = prices[i]
//     minIndex = i
//    }
//   }
//   if(minIndex === prices.length - 1) {
//     return 0
//   }
  
//   for (let i = 0; i < prices.length; i++) {
//     for (let j = i + 1; j < prices.length; j++) {
//       const profit = prices[j] - prices[i]
//       maxProfit = Math.max(maxProfit, profit)
//     }
//   }
//   return maxProfit
// }

// 仅在直接 `node dp-121.js` 时执行，被 jest require 时不打印
if (require.main === module) {
  const res = maxProfitOnce(prices)
  console.log('res>>>', res)
}

module.exports = { maxProfitOnce }
