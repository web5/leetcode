/**
 * 56. 合并区间（中等） · https://leetcode.cn/problems/merge-intervals/
 * 题干：plan/problems/sorting/056-merge-intervals.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（两两判重叠并合并，为什么会反复重扫）
 * 观察到的性质：____（按左端点排序后，能重叠的区间一定相邻——为什么）
 * 否掉：____（不排序只扫一遍行不行）
 * 最优：____（排序 + 单次扫描 O(n log n)）
 * 易错：____（相接算不算重叠：比较用 <= 不是 <；别改到入参子数组）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回合并后的区间数组（不要修改入参里的子数组） */
function merge(intervals) {
  throw new Error('056 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
  { name: '示例 2 相接', args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
  { name: '示例 3 乱序', args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
  { name: '单区间', args: [[[1, 2]]], expected: [[1, 2]] },
  { name: '被完全包含', args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
  { name: '内部区间', args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
  { name: '全不重叠', args: [[[2, 3], [4, 5], [6, 7], [8, 9]]], expected: [[2, 3], [4, 5], [6, 7], [8, 9]] },
  { name: '全部被第一个吞掉', args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(merge) : merge(...one.args))
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
  describe('56. 合并区间', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { merge, CASES }
