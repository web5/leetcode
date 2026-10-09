/**
 * 167. 两数之和 II - 输入有序数组（中等） · https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/
 * 题干：plan/problems/two-pointers/167-two-sum-ii-input-array-is-sorted.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（两层枚举 O(n²)）
 * 观察到的性质：____（**有序** + 只查一条答案 ⇒ 两端能各自丢一侧）
 * 否掉：____（哈希表 O(n) 也行，但题目要求常数级额外空间——这就是它被否掉的理由）
 * 最优：____（对撞双指针 O(n) / O(1)）
 * 易错：____（返回 **1 起始** 下标；和小于 target 就 lo++，大于就 hi--）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回 [index1, index2]（1 起始下标） */
function twoSum(numbers, target) {
  throw new Error('167 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[2, 7, 11, 15], 9], expected: [1, 2] },
  { name: '示例 2', args: [[2, 3, 4], 6], expected: [1, 3] },
  { name: '示例 3 含负数', args: [[-1, 0], -1], expected: [1, 2] },
  { name: '答案在尾巴上', args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] },
  { name: '只有两个数', args: [[1, 2], 3], expected: [1, 2] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(twoSum) : twoSum(...one.args))
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
  describe('167. 两数之和 II', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { twoSum, CASES }
