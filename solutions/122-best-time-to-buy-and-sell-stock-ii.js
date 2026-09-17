/**
 * 122. 买卖股票的最佳时机 II（中等）
 * 题目：problems/dynamic-programming/122-best-time-to-buy-and-sell-stock-ii.md
 * 思路：DP 状态机 —— cash 表示「当前不持股」的最大利润，hold 表示「当前持股」的最大利润。
 *      所有上升段利润全吃；DP 写法比贪心更通用（可扩展到手续费/冷冻期）。
 * 复杂度：时间 O(n)，空间 O(1)
 */

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
function maxProfitII(prices) {
  if (!prices || prices.length < 2) return 0
  let cash = 0
  let hold = -Infinity
  for (const p of prices) {
    const prevCash = cash
    cash = Math.max(cash, hold + p) // 保持空仓 vs 卖出（手持股票换成现金）
    hold = Math.max(hold, prevCash - p) // 保持持仓 vs 今天买入
  }
  return cash
}

// 仅在直接 `node 122-best-time-to-buy-and-sell-stock-ii.js` 时执行，被 jest require 时不打印
if (require.main === module) {
  const prices = [7, 1, 5, 4, 2, 6]
  console.log('res>>>', maxProfitII(prices))
}

module.exports = { maxProfitII }
