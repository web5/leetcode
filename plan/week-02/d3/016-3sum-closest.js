/**
 * 16. 最接近的三数之和（中等） · https://leetcode.cn/problems/3sum-closest/
 * 题干：plan/problems/two-pointers/016-3sum-closest.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（三重枚举 O(n³)）
 * 观察到的性质：____（和 15 同一个骨架，只是目标从「等于 0」变成「最小化 |sum - target|」）
 * 否掉：____（这题为什么不需要去重？和 15 的差异在哪一行）
 * 最优：____（排序 + 固定 i + 对撞双指针，O(n²)）
 * 易错：____（和等于 target 可提前返回；差值比较要用 Math.abs）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回与 target 最接近的三数之和 */
function threeSumClosest(nums, target) {
  throw new Error('016 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[-1, 2, 1, -4], 1], expected: 2 },
  { name: '示例 2 全 0', args: [[0, 0, 0], 1], expected: 0 },
  { name: 'target 远在负方向', args: [[1, 1, 1, 0], -100], expected: 2 },
  { name: '正好命中', args: [[1, 2, 3, 4], 6], expected: 6 },
  { name: '只有三个数', args: [[1, 2, 3], 100], expected: 6 },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(threeSumClosest) : threeSumClosest(...one.args))
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
  describe('16. 最接近的三数之和', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { threeSumClosest, CASES }
