/**
 * 217. 存在重复元素（简单）· 二刷 · https://leetcode.cn/problems/contains-duplicate/
 * 题干（旧题，在归档区）：archive/problems/array/217-contains-duplicate.md
 * 已有答案（盲写完再看）：archive/solutions/217-contains-duplicate.js · archive/tests/217-contains-duplicate.test.js
 * 复现：一刷 ____（旧题） · 二刷 10-09 ____ · 三刷 ____
 *
 * ── 二刷规矩：限时 10 分钟盲写，写完才允许翻笔记 ────────────
 * 一句话解法：____（只问「有没有重复」，不要求找出是谁重复）
 * 两种解法取舍：____（哈希 Set：O(n) 时间 / O(n) 空间；先排序：O(n log n) / O(1) 额外空间但会改动入参）
 * 否掉：____（为什么不能「拼成字符串再 includes」？给一组反例）
 * 易错：____（空数组 / 单元素必须 false；负数与多位数别被当成子串）
 * ─────────────────────────────────────────────────
 */

/** 作答区：有重复元素返回 true，否则 false（不改动入参） */
function containsDuplicate(nums) {
  throw new Error('217 containsDuplicate 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1：[1,2,3,1] → true', args: [[1, 2, 3, 1]], expected: true },
  { name: '示例 2：[1,2,3,4] → false', args: [[1, 2, 3, 4]], expected: false },
  { name: '示例 3：[1,1,1,3,3,4,3,2,4,2] → true', args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
  { name: '空数组 → false', args: [[]], expected: false },
  { name: '单元素 → false', args: [[1]], expected: false },
  { name: '两个相同 → true', args: [[0, 0]], expected: true },
  { name: '负数重复 → true', args: [[-1, 5, -1]], expected: true },
  { name: '拼字符串会误判：[12,2] → false', args: [[12, 2]], expected: false },
  { name: '拼字符串会误判：[-1,1] → false', args: [[-1, 1]], expected: false },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  return containsDuplicate(...one.args)
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

// 直接跑：node plan/week-01/d2/217-contains-duplicate.js
if (require.main === module) runAll()

// 走 jest：npm test
if (typeof describe === 'function') {
  describe('217. 存在重复元素（二刷）', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toBe(one.expected))
  })
}

module.exports = { containsDuplicate, CASES }
