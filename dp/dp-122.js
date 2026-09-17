/**
 * 122. 买卖股票的最佳时机 II（中等）
 * https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/
 * 标签：贪心、数组、动态规划
 *
 * 给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。
 * 在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。
 * 然而，你可以在 同一天 多次买卖该股票，但要确保你持有的股票不超过一股。
 * 返回你能获得的 最大 利润。
 *
 * 示例 1：
 *   输入：[7,1,5,3,6,4]
 *   输出：7
 *   解释：第 2 天（价格 = 1）买入，第 3 天（价格 = 5）卖出，利润 = 5-1 = 4。
 *        随后第 4 天（价格 = 3）买入，第 5 天（价格 = 6）卖出，利润 = 6-3 = 3。
 *        最大总利润为 4 + 3 = 7。
 *
 * 示例 2：
 *   输入：[1,2,3,4,5]
 *   输出：4
 *   解释：第 1 天（价格 = 1）买入，第 5 天（价格 = 5）卖出，利润 = 5-1 = 4。
 *
 * 示例 3：
 *   输入：[7,6,4,3,1]
 *   输出：0
 *   解释：交易无法获得正利润，所以不参与交易可以获得最大利润，最大利润为 0。
 *
 * 提示：
 *   1 <= prices.length <= 3 * 10^4
 *   0 <= prices[i] <= 10^4
 *
 * 思路：所有上升段利润全吃。DP 写法保持通用性。
 */
const prices = [7, 1, 5, 4, 2, 6]
 // ── cash ──────────────────────────────────────────
// 含义：当前处于「不持有股票」状态时，账户里的最大现金利润。
// 初始值为什么是 0？
//   因为第 0 天还没开始交易，兜里一分没赚也没亏，就是 0。
//   它代表"我选择一直空仓到现在，最多赚了多少钱"。

// ── hold ──────────────────────────────────────────
// 含义：当前处于「持有股票」状态时，账户里折算出来的最大利润。
// 注意：这个值不是"股票值多少钱"，而是"利润"——
//   持有股票的利润 = 之前攒的钱 - 当初买入时花的钱。
//   初始值为什么是 -Infinity？
//   因为循环开始前，我们还没有"买入"过任何股票。
//   如果用 0 当初始值，就相当于"第 0 天花 0 元买了一张不存在的票"，
//   逻辑就错了。用 -Infinity 表示"这个状态目前不可达"，
//   等第一天真的执行了买入动作（prevCash - p），它才会变成一个真实负数。
//   比如第一天价格 7，买入后 hold = 0 - 7 = -7，表示花了 7 块持有了股票。
function maxProfitInfinite(prices) {
  if (!prices || prices.length < 2) return 0
  let cash = 0, //
  hold = -Infinity //
  for(const p of prices) {
    const preCash = cash
    cash = Math.max(cash, hold + p) // 负数 不交易，cash 始终是正收益
    hold = Math.max(hold, preCash - p)
  }
  return cash
}

// function maxProfit(prices) {
//   if (!prices || prices.length < 2) return 0
//   let maxProfit = 0
//   for (let i = 0; i < prices.length - 1; i++) {
//     const price = prices[i]
//     const nextPrice = prices[i + 1]
//     if(nextPrice > price) {
//       maxProfit += nextPrice - price
//     }
//   }
//   return maxProfit
// }
// 仅在直接 `node dp-122.js` 时执行，被 jest require 时不打印
if (require.main === module) {
  const res = maxProfitInfinite(prices)
  console.log('res>>>', res)
}

module.exports = { maxProfitInfinite }
