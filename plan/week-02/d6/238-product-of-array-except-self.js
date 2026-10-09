/**
 * 238. 除了自身以外数组的乘积（中等） · https://leetcode.cn/problems/product-of-array-except-self/
 * 题干：plan/problems/prefix-sum/238-product-of-array-except-self.md
 * 复现：一刷 ____（提示/独立） · 二刷 ____ · 三刷 ____
 *
 * ── 五问笔记（写完才算做完，「否掉」不能省）────────────
 * 暴力：____（每个位置再乘一遍其余元素，O(n²)）
 * 观察到的性质：____（answer[i] = 左积 × 右积 ⇒ 前缀和思想搬到「积」上）
 * 否掉：____（用总积除以 nums[i] 行不行？为什么题目禁止——数组里可能有 0）
 * 最优：____（两次遍历：先存左积，再从右往左乘右积，O(n) / O(1) 额外空间）
 * 易错：____（第二次遍历要从 n-1 往 0；right 初值 1）
 * ─────────────────────────────────────────────────
 */

/** 作答区：返回 answer，其中 answer[i] = 除 nums[i] 外所有元素的乘积（不许用除法） */
function productExceptSelf(nums) {
  throw new Error('238 未作答')
}

/** 测试素材 */
const CASES = [
  { name: '示例 1', args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
  { name: '示例 2 含 0', args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
  { name: '两个元素', args: [[2, 3]], expected: [3, 2] },
  { name: '两个 0', args: [[0, 0]], expected: [0, 0] },
  { name: '含负数', args: [[1, -1]], expected: [-1, 1] },
  { name: '三个元素含 0', args: [[0, 1, 2]], expected: [2, 0, 0] },
]

// ── 以下不用改 ──────────────────────────────────────
function actualOf(one) {
  const norm = one.norm || ((v) => v)
  return norm(one.run ? one.run(productExceptSelf) : productExceptSelf(...one.args))
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
  describe('238. 除自身以外数组的乘积', () => {
    for (const one of CASES) test(one.name, () => expect(actualOf(one)).toEqual(expectedOf(one)))
  })
}

module.exports = { productExceptSelf, CASES }
