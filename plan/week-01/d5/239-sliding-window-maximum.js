/**
 * 239. 滑动窗口最大值（困难）· 二刷 · https://leetcode.cn/problems/sliding-window-maximum/
 * 题干（旧题，在归档区）：archive/problems/sliding-window/239-sliding-window-maximum.md
 * 已有答案（盲写完再看）：archive/solutions/239-sliding-window-maximum.js · archive/tests/239-sliding-window-maximum.test.js
 * 复现：一刷 ____（旧题） · 二刷 ____ · 三刷 ____
 *
 * ── 二刷规矩：限时 20 分钟盲写 ────────────
 * 数据结构：____（单调递减队列，存**下标**不存值）
 * 什么时候出队：____（① 队首下标滑出窗口 → 弹出队首；② 队尾对应的值 ≤ 新值 → 弹出队尾（用 <= 处理重复值））
 * 否掉：____（暴力 O(n·k) 在 n = 10^5 会超时；大顶堆 O(n log n) 可行但多花 log——说清取舍）
 * 易错：____（结果长度是 n-k+1；存值就判不出「该出窗口了」；重复值要用 <= 才不漏）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回每个窗口的最大值，长度 n - k + 1 */
function maxSlidingWindow(nums, k) {
  throw new Error('239 maxSlidingWindow 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1：[1,3,-1,-3,5,3,6,7], k = 3', args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
  { name: '示例 2：单元素', args: [[1], 1], expected: [1] },
  { name: '边界：k = nums.length，只有一个窗口', args: [[1, 3, -1, -3], 4], expected: [3] },
  { name: '单调递减：每个窗口最大值都是左端', args: [[5, 4, 3, 2, 1], 2], expected: [5, 4, 3, 2] },
  { name: '单调递增：每个窗口最大值都是右端', args: [[1, 2, 3, 4], 2], expected: [2, 3, 4] },
  { name: '含重复值（队尾弹出条件用 <= 才不漏）', args: [[1, 2, 2, 1], 3], expected: [2, 2] },
  { name: '含负数：最大值本身可以是负数', args: [[-7, -8, 7, 5, 7, 1], 3], expected: [7, 7, 7, 7] },
  { name: 'k = 1：每个元素自己就是一个窗口', args: [[3, -1, 2], 1], expected: [3, -1, 2] },
  { name: '性能：n = 10^5 递增序列（暴力 O(n·k) 会超时）', args: [Array.from({ length: 100000 }, (_, i) => i), 1000], expected: null, run: (fn, nums, k) => { const r = fn(nums, k); return [r.length, r[0], r[r.length - 1]] }, expectedOfRun: [99001, 999, 99999] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  return one.run ? one.run(maxSlidingWindow, ...one.args) : maxSlidingWindow(...one.args)
}
function expectedOf(one) {
  return one.expectedOfRun || one.expected
}

function runAll() {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (JSON.stringify(actual) === JSON.stringify(expectedOf(one))) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}\n   期望 ${JSON.stringify(expectedOf(one))}\n   实际 ${JSON.stringify(actual)}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d5/239-sliding-window-maximum.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('239. 滑动窗口最大值（二刷）', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { maxSlidingWindow, CASES }
