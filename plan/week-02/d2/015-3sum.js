/**
 * 15. 三数之和（中等）★ · https://leetcode.cn/problems/3sum/
 * 题干：plan/problems/two-pointers/015-3sum.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（三重枚举 O(n³)，且去重很难收拾）
 * 观察到的性质：____（排序后，-nums[i] 就变成两数之和；有序数组的两数之和可以双指针 O(n)）
 * 否掉：____（能不能用哈希表做两数之和？去重会失控——列出「为什么」）
 * 最优：____（排序 + 固定 i + 对撞双指针，O(n²)；三处去重：i / left / right）
 * 易错：____（i、left、right 三处都要跳过重复值；left < right 别写成 <=）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回所有和为 0 且不重复的三元组（顺序任意） */
function threeSum(nums) {
  throw new Error('015 未作答')
}

/** 测试素材：顺序无关 → norm 把每个三元组内部排序、再把列表排序 */
const CASES = [
  { name: '示例 1', args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], norm: normTuples },
  { name: '示例 2 无解', args: [[0, 1, 1]], expected: [], norm: normTuples },
  { name: '示例 3 全 0', args: [[0, 0, 0]], expected: [[0, 0, 0]], norm: normTuples },
  { name: '四个 0 只能出一组', args: [[0, 0, 0, 0]], expected: [[0, 0, 0]], norm: normTuples },
  { name: '多组解', args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]], norm: normTuples },
  { name: '全正数无解', args: [[1, 2, 3]], expected: [], norm: normTuples },
]

// ── 以下不用改 ──────────────────────────────────────
function normTuples(rows) {
  return rows
    .map((row) => [...row].sort((a, b) => a - b))
    .sort((x, y) => {
      for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i]
      return 0
    })
}

function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(threeSum) : threeSum(...one.args))
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
  describe('15. 三数之和', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { threeSum, CASES }
