/**
 * 704. 二分查找（简单）· 二刷 · https://leetcode.cn/problems/binary-search/
 * 题干（旧题，在归档区）：archive/problems/binary-search/704-binary-search.md
 * 已有答案（盲写完再看）：archive/solutions/704-binary-search.js · archive/tests/704-binary-search.test.js
 * 复现：一刷 ____（旧题） · 二刷 ____ · 三刷 ____
 *
 * ── 二刷规矩：限时 5 分钟盲写（这题是二分的「起手式」，要闭着眼写对）──
 * 一句话解法：____（闭区间写法：while (lo <= hi)，mid 取 lo + ((hi - lo) >> 1)）
 * 复杂度：____（时间 O(log n)，空间 O(1)）
 * 否掉：____（为什么不用 indexOf / 遍历？——那是 O(n)，题目要求 O(log n)）
 * 易错：____（`<=` 不能写成 `<`；lo/hi 的更新要与区间定义配套（+1 / -1）；mid 别用 (lo+hi)/2）
 * ─────────────────────────────────────────────────
 */

/** 作答区：找到返回下标，找不到返回 -1（nums 升序且无重复） */
function search(nums, target) {
  throw new Error('704 search 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1：target = 9 → 下标 4', args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
  { name: '示例 2：target = 2 不存在 → -1', args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
  { name: '单元素命中', args: [[5], 5], expected: 0 },
  { name: '单元素未命中', args: [[5], -5], expected: -1 },
  { name: '命中左端', args: [[-1, 0, 3, 5, 9, 12], -1], expected: 0 },
  { name: '命中右端', args: [[-1, 0, 3, 5, 9, 12], 12], expected: 5 },
  { name: '小于最小值 → -1', args: [[-1, 0, 3, 5, 9, 12], -100], expected: -1 },
  { name: '大于最大值 → -1', args: [[-1, 0, 3, 5, 9, 12], 100], expected: -1 },
  { name: '两个元素命中右边', args: [[1, 3], 3], expected: 1 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  return search(...one.args)
}

function runAll() {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (actual === one.expected) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}：期望 ${one.expected}，实际 ${actual}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d4/704-binary-search.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('704. 二分查找（二刷）', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toBe(one.expected))
  })
}

module.exports = { search, CASES }
