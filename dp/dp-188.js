// 最多买卖 K 次
// k ≥ n/2 退化为无限次；否则用 buy[j] / sell[j] 滚动。
const prices = [7, 1, 5, 4, 2, 6]
function maxProfitK(k, prices) {
  const n = prices.length
  if( n < 2 || k === 0) return 0

  // 边界优化：k足够大等价于无限次
  if(k >= Math.floor(n / 2)) {
    let profit = 0
    for( i = 1; i < n; i++) {
      profit += Math.max(0, prices[i] - prices[i - 1])
    }
    return profit
  }

  const buy = new Array(k + 1).fill(-Infinity)
  const sell = new Array(k + 1).fill(0)
  for(const p of prices) {
    for(let j = 1; j <= k; j++) {
      sell[j] = Math.max(sell[j], buy[j] + p) // 卖出，前一天买入，今天卖出，亏的就取0，不买不卖
      buy[j] = Math.max(buy[j], sell[j - 1] - p) // 买入，前一天买入， 价格为前一天卖出的结余现金 -今天的买入价
    }
  }
  return sell[k]
}
const res = maxProfitK(2, prices)
console.log('res>>>', res)
