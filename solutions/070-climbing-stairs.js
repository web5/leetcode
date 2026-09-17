/**
 * 70. 爬楼梯（简单）
 * 题目：problems/dynamic-programming/070-climbing-stairs.md
 * 思路：本质是斐波那契——到第 n 阶的方法数 = 到 n-1 阶（再爬 1 阶）+ 到 n-2 阶（再爬 2 阶）。
 *      用两个变量滚动代替数组，省空间。
 * 复杂度：时间 O(n)，空间 O(1)
 */
function climbStairs(n) {
  let prev = 1 // 到第 0 阶（起始）的方法数
  let cur = 1 // 到第 1 阶的方法数
  for (let i = 2; i <= n; i++) {
    const next = prev + cur
    prev = cur
    cur = next
  }
  return cur
}

module.exports = { climbStairs }
