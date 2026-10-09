/**
 * 128. 最长连续序列（中等） · https://leetcode.cn/problems/longest-consecutive-sequence/
 * 题干：plan/problems/hash-table/128-longest-consecutive-sequence.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（每个数往两边找，或排序后扫一遍 O(n log n)）
 * 观察到的性质：____（「连续」意味着只看 v、v+1、v+2…；谁才是序列的起点）
 * 否掉：____（排序是 O(n log n)，题目要 O(n)；只对起点做扩展为什么仍是 O(n)）
 * 最优：____（哈希集合 + 仅从起点向右扩，O(n)）
 * 易错：____（重复元素要先去重；只从「v-1 不在集合里」的 v 出发）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回最长连续序列的长度 */
function longestConsecutive(nums) {
  throw new Error('128 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
  { name: '示例 2', args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
  { name: '示例 3 重复元素', args: [[1, 0, 1, 2]], expected: 3 },
  { name: '空数组', args: [[]], expected: 0 },
  { name: '单元素', args: [[5]], expected: 1 },
  { name: '全相同', args: [[7, 7, 7]], expected: 1 },
  { name: '含负数', args: [[-3, -2, -1, 0]], expected: 4 },
  { name: '多段不连续', args: [[1, 2, 10, 11, 12, 20]], expected: 3 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(longestConsecutive) : longestConsecutive(...one.args))
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
  describe('128. 最长连续序列', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { longestConsecutive, CASES }
