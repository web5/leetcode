/**
 *
 *
 * ## 题目描述

给定一个数组 `prices`，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。

你只能选择 **某一天** 买入这只股票，并选择在 **未来的某一个不同的日子** 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0`。

## 示例

**示例 1：**
- 输入：`[7,1,5,3,6,4]`
- 输出：`5`
- 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5。注意利润不能是 7-1 = 6，因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。

**示例 2：**
- 输入：`[7,6,4,3,1]`
- 输出：`0`
- 解释：在这种情况下，没有交易完成，所以最大利润为 0。

## 提示

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`
} prices
 */
// 只有一次交易机会，所以需要找到最低的买入价格，并且不能是最后一天买入
// 循环遍历，每次取当前最大收益和当前价格 - 最低价格的最大值
// 动态规划需要转换的状态，帮我分析下

function maxProfitOnce(prices) {
  if(!prices || prices.length < 2) return 0
  let maxProfit = 0
  // 初始化最低价格为无穷大，防止数组第一个元素就是最低价格
  let minPrice = Infinity
  for(let price of prices) {
    maxProfit = Math.max(maxProfit, price - minPrice)
    minPrice = Math.min(minPrice, price)
  }
  return maxProfit
}
// const prices = [7,1,5,3,6,4]
const prices = [7,6,4,3,1]
const res = maxProfitOnce(prices)
console.log('res>>>', res)
