/**
 * 18. 四数之和（中等） · https://leetcode.cn/problems/4sum/
 * 题干：plan/problems/two-pointers/018-4sum.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（四重枚举 O(n⁴)）
 * 观察到的性质：____（三数之和外面再套一层；两数之和永远用双指针收口）
 * 否掉：____（能不能用哈希？去重更麻烦；列出理由）
 * 最优：____（排序 + 两层循环 + 对撞双指针，O(n³)；两处去重 ×2 = 四处）
 * 易错：____（-10^9 量级，四个相加在 JS 里安全，但在 int32 语言里会溢出——面试要主动说）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回所有和为 target 且不重复的四元组（顺序任意） */
function fourSum(nums, target) {
  throw new Error('018 未作答')
}

/** 测试素材：顺序无关 → norm 归一化 */
const CASES = [
  {
    name: '示例 1',
    args: [[1, 0, -1, 0, -2, 2], 0],
    expected: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]],
    norm: normTuples,
  },
  { name: '示例 2 全相同', args: [[2, 2, 2, 2, 2], 8], expected: [[2, 2, 2, 2]], norm: normTuples },
  { name: '四个 0', args: [[0, 0, 0, 0], 0], expected: [[0, 0, 0, 0]], norm: normTuples },
  { name: '无解', args: [[1, 2, 3], 100], expected: [], norm: normTuples },
  { name: '含重复值去重', args: [[-3, -1, 0, 2, 4, 5], 0], expected: [[-3, -1, 0, 4]], norm: normTuples },
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
  return norm(one.run ? one.run(fourSum) : fourSum(...one.args))
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
  describe('18. 四数之和', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { fourSum, CASES }
