/**
 * 41. 缺失的第一个正数（困难） · https://leetcode.cn/problems/first-missing-positive/
 * 题干：plan/problems/array/041-first-missing-positive.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（排序后扫，O(n log n)；或哈希集合 O(n) 但费 O(n) 空间）
 * 观察到的性质：____（长度 n 的数组，答案只可能是 1..n+1 ⇒ 下标本身就是哈希槽）
 * 否掉：____（用哈希集合为什么不够？题目要常数级额外空间）
 * 最优：____（原地哈希：把 v ∈ [1,n] 换到下标 v-1，再扫第一个 nums[i] !== i+1）
 * 易错：____（交换要用 while 且带 nums[i] !== nums[nums[i]-1] 防死循环；非正数直接跳过）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回没有出现的最小正整数 */
function firstMissingPositive(nums) {
  throw new Error('041 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[1, 2, 0]], expected: 3 },
  { name: '示例 2', args: [[3, 4, -1, 1]], expected: 2 },
  { name: '示例 3 全是大数', args: [[7, 8, 9, 11, 12]], expected: 1 },
  { name: '只有 1', args: [[1]], expected: 2 },
  { name: '只有 2', args: [[2]], expected: 1 },
  { name: '连续 1..3', args: [[1, 2, 3]], expected: 4 },
  { name: '只有 0', args: [[0]], expected: 1 },
  { name: '全负数', args: [[-1, -2]], expected: 1 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(firstMissingPositive) : firstMissingPositive(...one.args))
}
function expectedOf(one) {
  return (one.norm || ((v) => v))(one.expected)
}

if (require.main === module) {
  let pass = 0
  for (const one of CASES) {
    try {
      const actual = actualOf(one)
      if (JSON.stringify(actual) === JSON.stringify(expectedOf(one))) {
        pass++
        console.log(`✅ ${one.name}`)
      } else {
        console.log(`❌ ${one.name}\n   期望 ${JSON.stringify(one.expected)}\n   实际 ${JSON.stringify(actual)}`)
      }
    } catch (err) {
      console.log(`💥 ${one.name} 抛错：${err.message}`)
    }
  }
  console.log(`\n${pass}/${CASES.length} 通过`)
  if (pass < CASES.length) process.exitCode = 1
}

if (typeof describe === 'function') {
  describe('41. 缺失的第一个正数', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { firstMissingPositive, CASES }
