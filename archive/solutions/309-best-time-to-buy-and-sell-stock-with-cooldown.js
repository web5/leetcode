/**
 * 309. 最佳买卖股票时机含冷冻期（中等）
 * 题目：problems/dynamic-programming/309-best-time-to-buy-and-sell-stock-with-cooldown.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * 族谱：122（无限笔）+ 冷冻期 1 天，挂在 dp/README.md §10.5.6 的「交易成本维」。
 *  714 改的是「扣多少」，309 改的是「钱从哪来」。
 *
 * 思路：状态机，122 的两个状态（hold / cash）在这里要拆成三个 ——
 *   原因：冷冻期是一个「时间维度」约束，必须把「空仓」按时间点分开表示。
 *   hold  持股
 *   sold  今天卖出（明天处于冷冻，不能买）
 *   rest  空仓且不在冷冻期（可以买）
 *
 *   hold = max(hold, rest - p)    // 买入的钱只能来自 rest，不能来自今天刚卖的钱
 *   sold = prevHold + p           // 今天卖出
 *   rest = max(rest, prevSold)    // 昨天的卖出 → 今天解冻，进入可买入空仓
 *
 * 三处易错（全在「时间边界」上）：
 *  ① rest 必须用 prevSold（上一天的 sold）。写成 sold → 今天卖的钱明天就能买 → 冷冻期失效，退化成 122
 *  ② hold 只能用 rest 买入，不能用 sold（今天刚卖的钱）或 122 式的单一 cash
 *  ③ 答案取 max(sold, rest)：最后可能停在「刚卖出」或「空仓待买」两处
 * 另外：更新时要用 prevHold / prevSold 暂存，避免同一天内状态互相污染。
 *
 * 复杂度：时间 O(n)，空间 O(1)
 */

function maxProfitWithCooldown(prices) {
  const n = prices.length
  if (n < 2) return 0

  let hold = -prices[0] // 第 0 天买入
  let sold = 0 // 第 0 天卖出（等价于「什么都没做」，明天解冻）
  let rest = 0 // 第 0 天空仓非冷冻

  for (let i = 1; i < n; i++) {
    const p = prices[i]
    const prevHold = hold
    const prevSold = sold

    hold = Math.max(prevHold, rest - p) // 继续持有 vs 用「非冷冻空仓」的钱买入
    sold = prevHold + p // 今天卖出：收益是昨天持股的本金 + 今天的价格
    rest = Math.max(rest, prevSold) // 昨天卖出的钱，今天解冻后可用
  }

  return Math.max(sold, rest)
}

// 教学/校验用：记忆化暴力搜索（三维状态：天、是否持股、是否在冷冻期）
// 只用于对照正确性，不是最优解；小数组上跑得动
function maxProfitWithCooldownBruteForce(prices) {
  const n = prices.length
  const memo = new Map()

  const dfs = (i, holding, cooling) => {
    if (i === n) return 0
    const key = `${i}|${holding}|${cooling}`
    if (memo.has(key)) return memo.get(key)

    let best = dfs(i + 1, holding, false) // 今天什么都不做（冷冻自动解除）
    if (holding) {
      best = Math.max(best, prices[i] + dfs(i + 1, false, true)) // 今天卖出 → 明天冷冻
    } else if (!cooling) {
      best = Math.max(best, -prices[i] + dfs(i + 1, true, false)) // 今天买入
    }

    memo.set(key, best)
    return best
  }

  return dfs(0, false, false)
}

module.exports = { maxProfitWithCooldown, maxProfitWithCooldownBruteForce }

if (require.main === module) {
  console.log('res>>>', maxProfitWithCooldown([7, 1, 5, 3, 6, 4])) // 5
  console.log('res>>>', maxProfitWithCooldown([1, 2, 3, 0, 2])) // 3
  console.log('res>>>', maxProfitWithCooldown([1, 4, 2, 7])) // 6（122 会是 8）
}
