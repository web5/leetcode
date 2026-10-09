/**
 * 1. 两数之和（简单）· 二刷 · https://leetcode.cn/problems/two-sum/
 * 题干（旧题，在归档区）：archive/problems/array/001-two-sum.md
 * 已有答案（盲写完再看）：archive/solutions/001-two-sum.js · archive/tests/001-two-sum.test.js
 * 复现：一刷 ____（旧题） · 二刷 ____ · 三刷 ____
 *
 * ── 二刷规矩：限时 10 分钟盲写，写完才允许翻笔记 ────────────
 * 一句话解法：____（一遍遍历，用哈希表记住「值 → 下标」）
 * 复杂度：____（时间 O(n)，空间 O(n)；暴力两层循环是 O(n²)）
 * 否掉：____（能不能先排序再双指针？——排序后下标就丢了，而本题要返回**下标**）
 * 易错：____（先查 target - nums[i] 再存当前值，否则 [3,3] 这种会用到同一个元素）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回两个下标 [i, j]（顺序任意），保证恰好一组答案且不能用同一元素两次 */
function twoSum(nums, target) {
  throw new Error('001 twoSum 未作答')
}

/** 测试素材：答案下标顺序无关 → norm 把这一对下标从小到大排 */
const CASES = [
  { name: '示例 1：[2,7,11,15], 9', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
  { name: '示例 2：[3,2,4], 6', args: [[3, 2, 4], 6], expected: [1, 2] },
  { name: '示例 3：两个相同元素 [3,3], 6', args: [[3, 3], 6], expected: [0, 1] },
  { name: '只有两个元素', args: [[1, 2], 3], expected: [0, 1] },
  { name: '答案在靠后的位置', args: [[1, 2, 3, 4, 5, 6], 11], expected: [4, 5] },
  { name: '含负数', args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
  { name: '含 0 与重复值', args: [[0, 4, 3, 0], 0], expected: [0, 3] },
]

// ── 以下不用改 ──────────────────────────────────────
function normPair(pair) {
  return [...pair].sort((a, b) => a - b)
}

function actualOf(one) {
  return normPair(twoSum(...one.args))
}
function expectedOf(one) {
  return normPair(one.expected)
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
        console.log(`❌ ${one.name}：期望 ${JSON.stringify(expectedOf(one))}，实际 ${JSON.stringify(actual)}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

// 直接跑：node plan/week-01/d3/001-two-sum.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('1. 两数之和（二刷）', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { twoSum, CASES }
